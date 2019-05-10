const express = require ('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');

//routes
const users = require('./routes/api/users');

const app = express();

//Passport middleware
app.use(passport.initialize());
//Passport config
require('./config/passport')(passport);

//Body parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//DB config
const db = require('./config/keys').mongoURI;
//connnect to mongoDB
mongoose
    .connect(db, { useNewUrlParser: true } )    //removed Depricated {urlParser: true}
    .then(()=>{console.log("MongoDB Connected!")})
    .catch((err)=>console.log(err))

app.get('/',(req,res)=>{
    res.send("Hello world!");
})

// use Routes
app.use('/api/users',users);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{console.log("Listening on Port: " + port)});