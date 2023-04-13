var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('./admin/admin-login', { adminhd: true })
});

router.post('/', (req, res) => {
  if (req.body.aname == "admin") {
   if(req.body.apassword == "admin123")
   {
     
   }
  }
})



module.exports = router;
