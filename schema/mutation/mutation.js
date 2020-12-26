const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const bcrypt = require('bcrypt')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')

const addUser = {
	type:GraphQLString,
	description:'Adds a new user',
	args:{
		name:{ type : GraphQLNonNull(GraphQLString)},
		surname:{ type : GraphQLNonNull(GraphQLString)},
		username:{ type : GraphQLNonNull(GraphQLString)},
		email:{ type : GraphQLNonNull(GraphQLString)},
		password:{ type : GraphQLNonNull(GraphQLString)},		
	},
	resolve:(parent,args) =>{
		bcrypt.hash(args.password,10,function(err,hashed){
			if(err) throw err

			/*
				Add to database
			*/
			const newUser = new User({
				name:args.name,
				surname:args.surname,
				email:args.email,
				username:args.username,
				password:hashed,
			})
		
			newUser.save(function(err,u){
				if(err) throw err
			})
		})
		return 'New user added'
	}
}

const addProfile ={
	type:GraphQLString,
	description:'Adds a new profile',
	args:{
		user:{type:GraphQLNonNull(GraphQLString)},
		from:{type:GraphQLNonNull(GraphQLString)},
		birth_date:{type:GraphQLNonNull(GraphQLString)},
		gender:{type:GraphQLNonNull(GraphQLInt)}
	},
	resolve: async (parent,args) => {
		let user = await User.findOne({_id:new ObjectId(args.user)})

		if(!user){
			throw new Error('User does not exist')	
		} 


		let profile = await Profile.findOne({user:new ObjectId(args.user)})

		if(profile){
			throw new Error('A profile for this user already exists')
		}

		try{
			const newProfile = new Profile({
				user:args.user,
				from:args.from,
				birth_date:args.birth_date,
				gender:args.gender
			})

			nProfile = await newProfile.save()

			return 'Profile saved'
		}catch(e){
			throw e
		}
	}
}

module.exports = {
	addUser,
	addProfile
}