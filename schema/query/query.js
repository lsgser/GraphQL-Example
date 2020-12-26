const User = require('../../models/User')
const Profile = require('../../models/Profile')
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')

const UserType = new GraphQLObjectType({
	name:'User',
	description:'This represents a user that exists in our system.',
	fields:()=>({
		_id:{type:GraphQLString},
		name:{type:GraphQLString},
		surname:{type:GraphQLString},
		username:{type:GraphQLString},
		email:{type:GraphQLString},
		profile:{
			type:ProfileType,
			resolve: async (user)=>{
				try{
					const u = await User.findOne({$or:[{username:user.username},{_id:user._id}]})
					if(!u){
						throw new Error('User does not exits' )
					}

				 	const profile = await Profile.findOne({user:u._id})

					return profile
				}catch(err){
					throw err
				}
			}
		}
	})
})

const ProfileType = new GraphQLObjectType({
	name:'Profile',
	description:'This represents a profile that exists in our system.',
	fields:() => ({
		_id:{type:GraphQLString},
		user:{type:GraphQLString},
		from:{type:GraphQLString},
		gender:{type:GraphQLInt},
		picture:{type:GraphQLString},
		birth_date:{type:GraphQLString},
		user_info:{
			type:UserType,
			resolve:async (profile) => {
				try{
					const usr = await User.findOne({_id:profile.user})

					if(!usr){
						throw new Error('User does not exits')
					}

					return usr
				}catch(err){
					throw err
				}
			}
		}
	})
})

module.exports = {
	UserType,
	ProfileType
}