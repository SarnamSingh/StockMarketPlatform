const role = require('./role');
const userType = require('./role');

function User(){
    this.id = 0;
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.role = new role();
    this.userType = new userType();
    this.gender = '';
    this.loginId = '';
    this.loginPassword = '';
    this.createdOn = new Date();
    this.lastModifiedOn = new Date();
}

module.exports = User;
