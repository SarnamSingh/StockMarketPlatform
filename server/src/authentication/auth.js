const passport  = require("passport");
const passportJWT = require('passport-jwt');

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const strategyOptions = {
secretOrKey : global.gEnvConfig.tokenKey,
jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken()
}

module.exports = () => {
const strategy = new Strategy(strategyOptions, (payload, done)=>{
if(payload){
    done(null, payload);
}
else{
    done('not valid token', null);
}
});
passport.use(strategy);
return {
initialize: function(){ return passport.initialize();},
authenticate: function(){ return passport.authenticate("jwt", {session: false});}
};
}