var passport=require('passport');
var passportJWT=require('passport-jwt');
var config=require('./config.js');
var user=require('../models/loginModel.js')
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
var params = {
secretOrKey: config.jwtSecret,
jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {
  var strategy = new Strategy(params, function(payload, done) {
    var user1=user.findOne({'name':payload.name},function(err,user){
        if(user1){
          return done(null,{name:user1.name});
        }
        else{
            return done(new Error("User not found"), null);
        }
      });
    });
    passport.use(strategy);
    return {
      initialize: function() {
        return passport.initialize();
      },
      authenticate: function() {
        return passport.authenticate("jwt", config.jwtSession);
      }
    };
};
