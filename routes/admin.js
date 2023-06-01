var express = require('express');
var router = express.Router();
var admindb = require('../database/admin-base')
var shopedb = require('../database/shope-base')

/* GET home page. */
var adminverify = null
router.get('/', function (req, res, next) {
  console.log(adminverify)
  if (adminverify) {
    res.render('./admin/admin-login', { aerror: "Incorrect Username or Password" })
    adminverify = false
  }
  else {
    res.render('./admin/admin-login')
  }
});

router.post('/', (req, res) => {
  if (req.body.aname == "admin") {
    if (req.body.apassword == "admin123") {
      admindb.Get_product_list().then((pro) => {
        res.render('./admin/list-products', { adminhd: true, pro })
      })


    }
    else {
      adminverify = true
      res.redirect('/admin')
    }
  }
  else {

    adminverify = true
    res.redirect('/admin')
  }
})

router.get('/removepro', (req, res) => {
  admindb.Remove_Product(req.query.id).then((data) => {
    res.redirect('/admin')
  })
})

router.get('/lishopes', (req, res) => {
  admindb.Get_Details_Of_sHope_Users().then((suser) => {
    res.render('./admin/list-shopes', { adminhd: true, suser })
  })
})

router.get('/removesuser', (req, res) => {
  admindb.Remove_Shope_user(req.query.id).then((data) => {
    admindb.Remove_Products_At_TheTimeOf_removeSdhopes(req.query.id).then((data)=>
    {
      res.redirect('/admin/lishopes')
    })
   
  })
})

router.get('/listnuser', (req, res) => {
  admindb.Get_Details_Of_Normal_users().then((user) => {
    res.render('./admin/list-users', { user, adminhd: true })
  })
})

router.get('/removeuser', (req, res) => {
  admindb.Remove_Normal_User(req.query.id).then((data) => {
    res.redirect('/admin/listnuser')
  })
})

router.get('/accept', (req, res) => {
  admindb.Get_shope_Requests_TO_Admit().then((spinfo) => {
    res.render('./admin/accept-shope', { adminhd: true, sp: spinfo })
  })
})

router.post('/shopesignup', async(req, res) => {
  console.log(req.query.id);
  await shopedb.Do_signup(req.body).then((data) => {
     if(data)
     {
         admindb.Remove_Shope_user_from_TEMP_Base(req.query.id).then((datas)=>
         {
           res.redirect('/admin/accept')
         })
     }
  })
})

router.get('/removerequest', (req, res) => {
  console.log(req.query.id);
  admindb.Remove_Shope_user_from_TEMP_Base(req.query.id).then((data) => {
    res.redirect('/admin/accept')
  })
})
router.get('/userorders',(req,res)=>
{
  admindb.Get_user_orders_all_Connected_informations().then((pro)=>
  {
    res.render('./admin/user-orders', { pro, adminhd: true })
  })
})

module.exports = router;
