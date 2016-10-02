var express = require('express');
var router = express.Router();
var auth=require('../passport/auth.js')();

router.get('/',auth.authenticate(), function(req, res, next) {
  res.render('chat', { title: 'chat' });
});

router.get('/user',function(req,res,next){
 var name = req.query.name;
 res.render('chat', { title: 'chat' });
});

module.exports=router;
