var express = require("express");
var router = express.Router();
var userdb = require("../database/user-base");
var objectId = require("mongodb").ObjectId;

module.exports.verfyuserlogin = (req, res, next) => {
  if (req.session.ustatus) {
    next();
  } else {
    res.redirect("/login");
  }
};
/* GET users listing. */
router.get("/", function (req, res, next) {
  userdb.Get_all_Products().then((prod) => {
    if (req.session.ustatus) {
      console.log(prod);
      userdb.Get_cart_count(req.session.user._id).then((cunt) => {
        console.log(cunt);
        res.render("./user/first-page", {
          userhd: true,
          prod,
          user: req.session.user,
          cut: cunt,
        });
      });
    } else {
      res.render("./user/first-page", { userhd: true, prod, cut: 0 });
    }
  });
});

var signupmesssage = null;

router.get("/signup", (req, res) => {
  if (req.session.emailerr) {
    res.render("./user/signup-page", {
      userhd: true,
      mess: signupmesssage,
      err: "This Mail Address Already Exist",
    });
    signupmesssage = null;
    req.session.emailerr = false;
  } else {
    res.render("./user/signup-page", { userhd: true, mess: signupmesssage });
    signupmesssage = null;
  }
});

router.post("/signup", async (req, res) => {
  await userdb
    .To_check_Wetcher_The_Email_Exist_or_Not(req.body.email)
    .then((info) => {
      if (info) {
        req.session.emailerr = true;
        res.redirect("/signup");
      } else {
        userdb.Do_signup(req.body).then((data) => {
          signupmesssage = data;
          res.redirect("/signup");
        });
      }
    });
});

router.get("/login", (req, res) => {
  if (req.session.fail) {
    res.render("./user/login-page", {
      userhd: true,
      err: "Incorrect username or Password",
    });
    req.session.fail = false;
  } else {
    res.render("./user/login-page", { userhd: true });
  }
});

router.post("/login", (req, res) => {
  console.log(req.body);
  userdb.Do_login(req.body).then((state) => {
    if (state.status) {
      req.session.ustatus = true;
      req.session.user = state.user;
      res.redirect("/");
    } else {
      req.session.fail = true;
      res.redirect("/login");
    }
  });
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

router.get("/addcart", (req, res) => {
  console.log(req.query.id, req.query.shopeId);
  userdb
    .Products_Into_Cart(req.session.user._id, req.query.id, req.query.shopeId)
    .then((data) => {
      res.json({ status: true });
    });
});

router.get("/cart", this.verfyuserlogin, (req, res) => {
  userdb.Get_carted_products_Details(req.session.user._id).then((cartpro) => {
    userdb
      .Total_amount_from_carted_products(req.session.user._id)
      .then((total) => {
        console.log(cartpro);
        if (total == 0) {
          res.render("./user/cart-page", {
            userhd: true,
            user: req.session.user,
            cartpro,
          });
        } else {
          res.render("./user/cart-page", {
            userhd: true,
            user: req.session.user,
            cartpro,
            total,
          });
        }
      });
  });
});
router.post("/cartqut", (req, res) => {
  console.log("Hi...");
  console.log(req.session.user._id);
  userdb.Change_product_Quantity(req.body).then((data) => {
    if (data.data) {
      res.json({ remove: true });
    } else {
      userdb
        .Total_amount_from_carted_products(req.session.user._id)
        .then((Total) => {
          res.json({ get: true, total: Total });
        });
    }
  });
});
router.get("/removecart", (req, res) => {
  userdb
    .Remove_cart_product(req.query.id, req.session.user._id)
    .then((data) => {
      res.redirect("/cart");
    });
});

router.get("/placeorder", this.verfyuserlogin, (req, res) => {
  userdb
    .Total_amount_from_carted_products(req.session.user._id)
    .then((total) => {
      res.render("./user/order-form", {
        userhd: true,
        user: req.session.user,
        total,
      });
    });
});

router.get("/proinfo", this.verfyuserlogin, (req, res) => {
  userdb.Get_Product_info_TO_BE_clicked(req.query.id).then((prod) => {
    userdb.Get_cart_count(req.session.user._id).then((cunt) => {
      res.render("./user/one-pro", {
        userhd: true,
        prod,
        user: req.session.user,
        cut: cunt,
      });
    });
  });
});

router.post("/placeorder", this.verfyuserlogin, (req, res) => {
  req.body.date = new Date();
  req.body.userId = objectId(req.session.user._id);
  req.body.status = req.body.pay === "cod" ? "placed" : "pending";

  userdb
    .Total_amount_from_carted_products(req.session.user._id)
    .then((total) => {
      req.body.total = total;
      userdb.Get_Cart_Products(req.session.user._id).then((products) => {
        req.body.products = products.product;
        req.body.shopeId = products.shopeId;
        console.log(req.body);
        userdb.Place_Order_From_user(req.body).then(async (data) => {
          if (data) {
            await userdb
              .Remove_All_ProductsFromthe_UserCartAt_theTimeOf_Place_Order(
                req.session.user._id
              )
              .then((rem) => {
                res.render("./user/after-placed", {
                  userhd: true,
                  user: req.session.user,
                });
              });
          }
        });
      });
    });
});

router.get("/vieworder", this.verfyuserlogin, (req, res) => {
  console.log("Hi hellooooo");
  userdb.View_Plaeced_Orders(req.session.user._id).then((info) => {
    // console.log(info);
    res.render("./user/view-orders", {
      userhd: true,
      user: req.session.user,
      info,
    });
  });
});
router.get("/about", (req, res) => {
  res.render("./user/about-page", { userhd: true, user: req.session.user });
});

module.exports = router;
