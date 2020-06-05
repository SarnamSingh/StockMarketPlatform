const express = require('express');
const router = express.Router();
const User = require('../models/user');
const executeQuery = require('../utility/dbHelper');
const utility = require('../utility/utility');
const responseObject = require('../models/responseModel');
const jwt = require('jsonwebtoken');
const auth = require("../authentication/auth")();

router.post('/login', (req, res) => {
    const user = new User();
    user.loginId = req.body.loginId;
    user.loginPassword = utility.encrypt(req.body.loginPassword, global.gEnvConfig.encryptionDecryptionKey);
    executeQuery(user, "usp_User_SelectByLoginIdPassword", (err, data)=>{
        const responseDetail = new responseObject();
        if (err) {
            responseDetail.status = "fail";
            responseDetail.errorMessage = err.message;
            responseDetail.errorStack = err.stack;
        }
        else {
            responseDetail.status = "user authenticated successfully.";
            delete responseDetail.errorMessage;
            delete responseDetail.errorStack;
            responseDetail.data = jwt.sign(data[0], global.gEnvConfig.tokenKey, {expiresIn: global.gEnvConfig.tokenExpirationTime});
        }
        res.json(responseDetail);
});
});
router.get('/:id', (req, res)=>{
    const user = new User();
    user.id = +(req.params["id"]);
    executeQuery(user, "usp_User_SelectById", (err, data)=>{
        res.json(utility.getResponse(err, data));
    });
})
.get('/', (req, res)=>{
    let user = new User();
    let procedureName = '';
    if(req.query && Object.keys(req.query).length > 0){
        for (const queryParam in req.query){
            user[queryParam] = req.query[queryParam];
        }
        procedureName = 'usp_User_SelectByAnyColumn';
    }
    else{
        procedureName =  "usp_User_SelectAll";
        user = null;
    }
    executeQuery(user, procedureName, (err, data)=>{
        res.json(utility.getResponse(err, data));
    });
    })
.post('/', (req, res)=>{
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.role.id = req.body.role.id;
    user.userType.id = req.body.userType.id;
    user.gender = req.body.gender;
    user.loginId = req.body.loginId;
    user.loginPassword = utility.encrypt( req.body.loginPassword.toString(), global.gEnvConfig.encryptionDecryptionKey);
    executeQuery(user, "usp_User_Insert", (err, data) => {
        res.json(utility.getResponse(err, data));
    });

})
.put('/', auth.authenticate(),  (req, res)=>{
    const user = new User();
    user.id = req.body.id;
    user.email = req.body.email;
    user.role.id = req.body.role.id;
    user.userType.id = req.body.userType.id;
    user.loginId = req.body.loginId;
    executeQuery(user, "usp_User_Update", (err, data)=>{
        res.json(utility.getResponse(err, data));
    })
   
})
.delete('/',  auth.authenticate(), (req, res)=>{
    const user = new User();
    user.id = req.body.id;
    executeQuery(user, "usp_User_Delete",(err, data)=>{
        res.json(utility.getResponse(err, data));
    })
   
})

module.exports = router;