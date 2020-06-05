function UserType(){
    this.id =0;
    this.name = '';
    this.description = '';
    this.createdOn = new Date();
    this.lastModifiedOn = new Date();
}

module.exports = UserType;