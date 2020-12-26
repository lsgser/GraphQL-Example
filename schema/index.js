const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const User = require('../models/User')
const Profile = require('../models/Profile')
const {UserType, ProfileType} = require('./query/query')
const { addUser,addProfile } = require('./mutation/mutation')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')

//Root query and root mutations
const RootQueryType = new GraphQLObjectType({
	name:'Query',
	description: 'Root Query',
	fields:() =>({
		user:{
			type:UserType,
			description:'A single user',
			args:{
				username:{ type: GraphQLString},
				id:{ type: GraphQLString}
			},
			resolve: async (parent,args)=>{
				let user = await User.findOne({$or:[{username : args.username},{ _id : new ObjectId(args.id)}]},'username name surname email')
				return user
			}
		},
		users:{
			type: new GraphQLList(UserType),
			description:'A list of users',
			resolve: async ()=>{
				let users = await User.find({},'username name surname email')
				return users			
			}
		},
		profile:{
			type:ProfileType,
			description:'A user profile',
			args:{
				user:{type: GraphQLNonNull(GraphQLString)}
			},
			resolve: async (parent,args)=>{
				try{
					let profile = await Profile.findOne({user:new ObjectId(args.user)})

					return profile
				}catch(e){
					throw err
				}
			}
		},
		profiles:{
			type: new GraphQLList(ProfileType),
			description:'A list of profiles',
			resolve: async () =>{
				try{
					let profiles = await Profile.find({})
					return profiles
				}catch(e){
					throw err
				}
			}
		}
	})
})

const RootMutationType = new GraphQLObjectType({
	name:'Mutation',
	description:'Root Mutation',
	fields:()=>({
		addUser,
		addProfile
	})
})

const schema = new GraphQLSchema({
	query:RootQueryType,
	mutation:RootMutationType
})

module.exports = schema;