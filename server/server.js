const express = require('express');
require('./src/config/config');
const bodyParser = require('body-parser');
const router  = require('./src/routes/routes');
const auth = require("./src/authentication/auth")();

//setting up server
const app = express();
app.use(bodyParser.json());
app.use(auth.initialize());
app.use('/', router);
//app.listen(global.gEnvConfig.port, ()=>{
  //  console.log(`${process.env.NODE_ENV} listening on http://localhost:${global.gEnvConfig.port}`);
//});

var port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`${process.env.NODE_ENV} listening on http://localhost:${port}`);
});


