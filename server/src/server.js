const express = require('express');
require('./config/config');
const bodyParser = require('body-parser');
const router  = require('./routes/routes');
const auth = require("./authentication/auth")();

//setting up server
const app = express();
app.use(bodyParser.json());
app.use(auth.initialize());
app.use('/', router);
app.listen(global.gEnvConfig.port, ()=>{
    console.log(`${process.env.NODE_ENV} listening on http://localhost:${global.gEnvConfig.port}`);
});


