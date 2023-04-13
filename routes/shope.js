var express = require('express');
var router = express.Router();
var shopedb = require('../database/shope-base')

/* GET home page. */
router.get('/', function (req, res, next) {
    if(req.session.status)
    {
        res.render('./shope/first-page', { shopehd: true,suser:req.session.suser})
    }
    else
    {
        res.render('./shope/first-page', { shopehd: true })
    }
});

var signupmesssage = null

router.get('/signup', (req, res) => {
    res.render('./shope/signup-page', { shopehd: true, mess: signupmesssage })
    signupmesssage = null
})

router.post('/signup', (req, res) => {
    shopedb.Do_signup(req.body).then((data) => {
        signupmesssage = data;
        res.redirect('/shope/signup')
    })
})

router.get('/login', (req, res) => {
    if(req.session.failed)
    {
        res.render('./shope/login-page', { shopehd: true,message:"Incorrect username or Password"})
        req.session.failed=false
    }
    else
    {
        res.render('./shope/login-page', { shopehd: true })
    }
})

router.post('/login', (req, res) => {
    //console.log(req.body)
    shopedb.Do_login(req.body).then((state) => {
        if (state.status) {

            req.session.status = true;
            req.session.suser = state.user
            res.redirect('/shope')
           
            

        }
        else {
            req.session.failed = true
            res.redirect('/shope/login')
        }
    })
})
router.get('/logout',(req,res)=>
{
    req.session.destroy()
    res.redirect('/shope/login')
})



module.exports = router;
