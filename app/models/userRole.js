
//app/models/user.js
//load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//define the schema for our user model

var userRoleSchema = mongoose.Schema({	
	_id:{ type: Number, default: 1 },
	created_date: Date,
	updated_date: Date,
	role: String,
	user_id: { type: Number, default: 2 },
	 _v : 0,
});


//methods ======================
//generating a hash
//create the model for users and expose it to our app
userRoleSchema.methods.generateHash = function(password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
userRoleSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('user_Role', userRoleSchema);