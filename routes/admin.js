var express = require('express');
var router = express.Router();
var admindb = require('../database/admin-base')
var shopedb = require('../database/shope-base')

const verfyadmin=(req,res,next)=>
{ 
  if (req.session.admin)
  {
    next()
  }
  else
  {
    res.redirect('/admin/')
  }

}
/* GET home page. */

router.get('/', function (req, res, next) {
  if (req.session.adminfail) {
    res.render('./admin/admin-login', { aerror: "Incorrect Username or Password" })
    req.session.adminfail = false
  }
  else {
    res.render('./admin/admin-login')
  }
});

router.post('/', (req, res) => {
  admindb.Do_admin_LoGIN(req.body).then((obj)=>
  {
     if(obj.status)
     {
       req.session.admin="admin"
       res.redirect('/admin/accept')

     }
     else
     {
      req.session.adminfail=true
       res.redirect('/admin')
     }
  })
})

router.get('/removepro',verfyadmin, (req, res) => {
  admindb.Remove_Product(req.query.id).then((data) => {
    res.redirect('/admin')
  })
})

router.get('/lishopes', verfyadmin, (req, res) => {
  admindb.Get_Details_Of_sHope_Users().then((suser) => {
    res.render('./admin/list-shopes', { adminhd: true, suser })
  })
})

router.get('/removesuser', verfyadmin, (req, res) => {
  admindb.Remove_Shope_user(req.query.id).then((data) => {
    admindb.Remove_Products_At_TheTimeOf_removeSdhopes(req.query.id).then((data)=>
    {
      res.redirect('/admin/lishopes')
    })
   
  })
})

router.get('/listnuser', verfyadmin, (req, res) => {
  admindb.Get_Details_Of_Normal_users().then((user) => {
    res.render('./admin/list-users', { user, adminhd: true })
  })
})

router.get('/removeuser', verfyadmin, (req, res) => {
  admindb.Remove_Normal_User(req.query.id).then((data) => {
    res.redirect('/admin/listnuser')
  })
})

router.get('/accept', verfyadmin, (req, res) => {
  admindb.Get_shope_Requests_TO_Admit().then((spinfo) => {
    res.render('./admin/accept-shope', { adminhd: true, sp: spinfo })
  })
})

router.post('/shopesignup', verfyadmin, async(req, res) => {
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

router.get('/removerequest', verfyadmin, (req, res) => {
  console.log(req.query.id);
  admindb.Remove_Shope_user_from_TEMP_Base(req.query.id).then((data) => {
    res.redirect('/admin/accept')
  })
})
router.get('/userorders', verfyadmin,(req,res)=>
{
  admindb.Get_user_orders_all_Connected_informations().then((pro)=>
  {
    res.render('./admin/user-orders', { pro, adminhd: true })
  })
})
router.get('/logout',(req,res)=>
{
   req.session.admin=null
   res.redirect('/admin/')
})
router.get('/listpro',(req,res)=>
{
   admindb.Get_product_list().then((pro)=>
   {
     res.render('./admin/list-products', { pro, adminhd: true })
   })
})

module.exports = router;
