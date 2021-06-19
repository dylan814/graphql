
const morgan = require('morgan');
const dotenv = require('dotenv');
const expressValidator = require('express-validator');
const cookieParser = require("cookie-parser");
const fs = require("fs");
const cors = require("cors");


const express = require('express');
const jwt = require('express-jwt')
const {graphqlHTTP} = require('express-graphql');
const schema   = require('./schema/schema.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

dotenv.config();
const app = express ();



require('dotenv').config()

// auth middleware

const auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false
})


// mongodb+srv://iato99:iato99@cluster0.xvyqf.mongodb.net/nodeapi?retryWrites=true&w=majority

mongoose.connect( process.env.MONGO_URI,
 { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});


app.use(bodyParser.json());
app.use(cors());
app.use(auth);
app.use("/graphql", graphqlHTTP ( (req,res) => ({

schema:schema,
graphiql:true,
context:{req,res,user: req.user}

})));

app.listen(process.env.PORT, () => {


    console.log("The server is listening on port 8080");
})