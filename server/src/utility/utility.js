const crypto = require('crypto');
const responseObject = require('../models/responseModel');
exports. encrypt = (text, key) =>{
    let cipher = crypto.createCipher('aes-256-cbc', key);
    let crypted = cipher.update(text, 'utf-8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

exports. decrypt = (encryptedData, key)=>{
    let decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

exports. getResponse = (err, data)=>{
    const responseDetail = new responseObject();
        if (err) {
            responseDetail.status = "fail";
            responseDetail.errorMessage = err.message;
            responseDetail.errorStack = err.stack;
        }
        else {
            responseDetail.status = "success";
            responseDetail.data = data;
            delete responseDetail.errorStack;
            delete responseDetail.errorMessage;
        }

        return responseDetail;
}

exports.logError = (response)=>{
console.log(`Error : ${response.errorMessage}, stack: ${response.errorStack}`);
};