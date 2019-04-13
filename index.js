const express = require ('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');

const app = express();

//DB config
const db = require('./config/keys').mongoURI;
//connnect to mongoDB
mongoose
    .connect(db)
    .then(()=>{console.log("MongoDB Connected!")})
    .catch((err)=>console.log(err))

app.get('/',(req,res)=>{
    res.send("Hello world!");
})

// use Routes
app.use('/api/users',users);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{console.log("Listening on Port: " + port)});