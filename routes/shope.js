var express = require("express");
var router = express.Router();
var shopedb = require("../database/shope-base");
var objectId = require("mongodb").ObjectId;

module.exports.verfyshopelogin = (req, res, next) => {
  if (req.session.suser) {
    next();
  } else {
    res.redirect("/shope/login");
  }
};

/* GET home page. */
router.get("/", function (req, res, next) {
  if (req.session.suser) {
    res.render("./shope/first-page", {
      shopehd: true,
      suser: req.session.suser,
    });
  } else {
    res.render("./shope/first-page", { shopehd: true });
  }
});

var signupmesssage = null;

router.get("/signup", (req, res) => {
  res.render("./shope/signup-page", { shopehd: true, mess: signupmesssage });
  signupmesssage = null;
});

router.post("/signup", (req, res) => {
  shopedb.shope_info_temparrayBase(req.body).then((data) => {
    signupmesssage = data;
    res.redirect("/shope/signup");
  });
});

router.get("/login", (req, res) => {
  if (req.session.failed) {
    res.render("./shope/login-page", {
      shopehd: true,
      message: "Incorrect username or Password",
    });
    req.session.failed = false;
  } else {
    res.render("./shope/login-page", { shopehd: true });
  }
});

router.post("/login", (req, res) => {
  console.log(req.body);
  shopedb.Do_login(req.body).then((state) => {
    if (state.status) {
      req.session.suser = state.user;
      req.session.suser.status = true;
      res.redirect("/shope");
    } else {
      req.session.failed = true;
      res.redirect("/shope/login");
    }
  });
});
router.get("/logout", (req, res) => {
  req.session.suser = null
  res.redirect("/shope/login");
});

router.get("/addpro", this.verfyshopelogin, (req, res) => {
  res.render("./shope/add-product", {
    shopehd: true,
    suser: req.session.suser,
  });
});

router.post("/addpro", async (req, res) => {
  console.log(req.body);
  req.body.pprice = await parseInt(req.body.pprice);
  console.log(req.body);
  var state = {
    pro: req.body,
    shopeId: objectId(req.session.suser._id),
  };
  //console.log(req.body)
  shopedb.Add_products(state).then((Id) => {
    var image = req.files.pimage;
    if (image) {
      image.mv("public/shope-image/" + Id + ".jpg", (err, data) => {
        if (err) {
          console.log("err", err);
        }
      });
    }
    shopedb.Add_Duplicate_Products(state).then(async (Id) => {
      var image2 = req.files.pimage;
      if (image2) {
        await image2.mv(
          "public/shope-imagedDpe/" + Id + ".jpg",
          (err, data) => {
            if (err) {
              console.log("err", err);
            }
          }
        );
      }
    });
    res.redirect("/shope/addpro");
  });
});

router.get("/listpro", this.verfyshopelogin, (req, res) => {
  shopedb.Get_shopes_products(req.session.suser._id).then((pros) => {
    res.render("./shope/list-product", {
      shopehd: true,
      pros,
      suser: req.session.suser,
    });
  });
});

router.get("/delete", (req, res) => {
  // console.log(req.query.id)
  shopedb.Delete_peoduct(req.query.id).then((data) => {
    res.redirect("/shope/listpro");
  });
});

router.get("/editpro", this.verfyshopelogin, (req, res) => {
  shopedb.Get_Product_Detailsfor_Edit(req.query.id).then((prod) => {
    console.log(prod);
    res.render("./shope/edit-product", {
      suser: req.session.suser,
      shopehd: true,
      prod,
    });
  });
});

router.post("/editpro", async (req, res) => {
  req.body.pprice = await parseInt(req.body.pprice);
  console.log(req.body);

  shopedb.Update_products_details(req.query.id, req.body).then((data) => {
    res.redirect("/shope/listpro");

    if (req.files.pimage) {
      var img = req.files.pimage;
      img.mv("public/shope-image/" + req.query.id + ".jpg", (err, data) => {
        if (err) {
          console.log("err", err);
        }
      });
    }
  });
});
router.get("/userorder", this.verfyshopelogin, (req, res) => {
  shopedb.Get_order_information(req.session.suser._id).then((info) => {
    console.log(info);
    res.render("./shope/view-orders", {
      suser: req.session.suser,
      shopehd: true,
      info,
    });
  });
});
router.get("/about", (req, res) => {
  res.render("./shope/about-page", { suser: req.session.suser, shopehd: true });
});

module.exports = router;
