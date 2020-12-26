const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = Schema({
	user: {
	    type: Schema.Types.ObjectId,
	    ref: 'User',
	    unique:true
  	},
	from:String,
	gender:Number,
	picture:String,
	birth_date:Date,
},{timestamps:true})

module.exports = mongoose.model('Profile',ProfileSchema)