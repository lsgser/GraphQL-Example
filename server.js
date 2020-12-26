const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const connectDB = require('./config/db');
const schema = require('./schema/index')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
dotenv.config()

connectDB()

// Enable All CORS Requests
app.use(cors())

app.use('/graphql',graphqlHTTP({
	schema,
	graphiql:true
}))

app.listen(process.env.PORT,() => console.log('Port :'+process.env.PORT))


