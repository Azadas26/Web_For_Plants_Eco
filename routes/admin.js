var express = require('express');
var router = express.Router();
var admindb = require('../database/admin-base')

/* GET home page. */
var adminverify=null
router.get('/', function (req, res, next) {
  console.log(adminverify)
   if(adminverify)
   {
     res.render('./admin/admin-login', { aerror:"Incorrect Username or Password"})
     adminverify=false
   }
   else
   {
     res.render('./admin/admin-login')
   }
});

router.post('/', (req, res) => {
  if (req.body.aname == "admin") {
   if(req.body.apassword == "admin123")
   {
       admindb.Get_product_list().then((pro)=>
       {
         res.render('./admin/list-products', { adminhd: true,pro})
       })
      
      
   }
   else
   {
      adminverify=true
      res.redirect('/admin')
   }
  }
  else
  {
    
    adminverify=true
    res.redirect('/admin')
  }
})

router.get('/removepro',(req,res)=>
{
    admindb.Remove_Product(req.query.id).then((data)=>
    {
      res.redirect('/admin')
    })
})

router.get('/lishopes',(req,res)=>
{
  admindb.Get_Details_Of_sHope_Users().then((suser)=>
  {
    res.render('./admin/list-shopes', { adminhd: true,suser})
  })
})

router.get('/removesuser',(req,res)=>
{
    admindb.Remove_Shope_user(req.query.id).then((data)=>
    {
      res.redirect('/admin//lishopes')
    })
})

router.get('/listnuser',(req,res)=>
{
   admindb.Get_Details_Of_Normal_users().then((user)=>
   {
     res.render('./admin/list-users', { user, adminhd: true })
   })
})

router.get('/removeuser',(req,res)=>
{
   admindb.Remove_Normal_User(req.query.id).then((data)=>
   {
     res.redirect('/admin/listnuser')
   })
})


module.exports = router;
