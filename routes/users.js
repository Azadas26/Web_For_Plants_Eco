var express = require('express');
var router = express.Router();
var userdb = require('../database/user-base')


module.exports.verfyuserlogin = (req, res, next) => {
  if (req.session.ustatus) {
    next()
  }
  else {
    res.redirect('/login')
  }
}
/* GET users listing. */
router.get('/', function (req, res, next) {
  userdb.Get_all_Products().then((prod) => {
    if (req.session.ustatus) {

      userdb.Get_cart_count(req.session.user._id).then((cunt) => {
        console.log(cunt)
        res.render('./user/first-page', { userhd: true, prod, user: req.session.user, cut: cunt })
      })
    }
    else {

      res.render('./user/first-page', { userhd: true, prod, cut: 0 })
    }
  })
});

var signupmesssage = null

router.get('/signup', (req, res) => {
  res.render('./user/signup-page', { userhd: true, mess: signupmesssage })
  signupmesssage = null
})

router.post('/signup', (req, res) => {
  userdb.Do_signup(req.body).then((data) => {
    signupmesssage = data;
    res.redirect('/signup')
  })
})

router.get('/login', (req, res) => {
  if (req.session.fail) {
    res.render('./user/login-page', { userhd: true, message: "Incorrect username or Password" })
    req.session.failed = false
  }
  else {
    res.render('./user/login-page', { userhd: true })
  }
})

router.post('/login', (req, res) => {
  //console.log(req.body)
  userdb.Do_login(req.body).then((state) => {
    if (state.status) {

      req.session.ustatus = true;
      req.session.user = state.user
      res.redirect('/')



    }
    else {
      req.session.fail = true
      res.redirect('/login')
    }
  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

router.get('/addcart', (req, res) => {
  userdb.Products_Into_Cart(req.session.user._id, req.query.id).then((data) => {
    res.json({ status: true })
  })
})

router.get('/cart', this.verfyuserlogin, (req, res) => {
  userdb.Get_carted_products_Details(req.session.user._id).then((cartpro) => {
    userdb.Total_amount_from_carted_products(req.session.user._id).then((total)=>
    {
     res.render('./user/cart-page', { userhd: true, user: req.session.user, cartpro,total})
    })
  })
})
router.post('/cartqut', (req, res) => {
  console.log("Hi...")
  console.log(req.session.user._id);
  userdb.Change_product_Quantity(req.body).then((data) => {
    if(data.data)
    {
      res.json({remove:true})
    }
    else
    {
      userdb.Total_amount_from_carted_products(req.session.user._id).then((Total)=>
      {
        res.json({ get: true,total:Total})
      })
     
    }
  })
})
router.get('/removecart',(req,res)=>
{
   userdb.Remove_cart_product(req.query.id,req.session.user._id).then((data)=>
   {
      res.redirect('/cart')
   })
})

router.get('/placeorder',this.verfyuserlogin,(req,res)=>
{
  userdb.Total_amount_from_carted_products(req.session.user._id).then((total) => {

    res.render('./user/order-form', { userhd: true, user: req.session.user,total})
  
  })
  
})

module.exports = router;
