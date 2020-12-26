const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = Schema({
	name:String,
	surname:String,
	email:{
		type:String,
		unique: true,
    	lowercase: true,
    	trim: true
    },
    username:{
    	type:String,
    	unique: true
    },
	password:String,
	following:[{user_id:String,username:String}],
	followers:[{user_id:String,username:String}]
},{timestamps:true})

module.exports = mongoose.model('User',UserSchema)