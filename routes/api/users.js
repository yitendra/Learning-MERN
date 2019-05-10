const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const passport =  require('passport');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// Load User Model
const User = require('../../models/User');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//@route   GET api/users/test
//@desc    Test the users.js
router.get('/test',(req,res)=>res.json({msg:"This is a User"}));

//@route  GET api/users/register
//@desc   Register a new user
router.post('/register', (req, res) => {
  
  const {errors, isValid} = validateRegisterInput(req.body);
    //Check Validation
    if(!isValid){
      return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        errors.email = 'Email already exists';
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200', // Size
          r: 'pg', // Rating
          d: 'mm' // Default
        });
  
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });
  
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  });

//@route  POST api/users/login
//@desc   login a user and get a token
router.post('/login',(req,res)=>{
  
  const {errors, isValid} = validateLoginInput(req.body);
    //Check Validation
    if(!isValid){
      return res.status(400).json(errors);
    }
  const email = req.body.email;
  const password = req.body.password;

  //Find user by emailID
  User.findOne({email}).then(user=>{
    //Check if user exists
    if(!user){
      errors.email = 'User not Found!!!'
      return res.status(404).json(errors)
    }

    //Check Password
    bcrypt.compare(password,user.password).then(isMatch=>{
      if(isMatch){
        //is matched
        payload =  {id:user.id,name:user.name,avatar:user.avatar};  //Payload for jwt

        //sign jwt token
        jwt.sign(payload, keys.secretOrKey, {expiresIn:3600}, (err, token)=>{   //payload data, a key string, expiry time
          res.json({
            success:true,
            token: 'Bearer ' + token
          })
        });  
      }
      else{
        errors.password = 'Password Incorrect!!!'
        return res.status(400).json(errors)
      }
    })
  })
})


//@route  GET api/users/current
//@desc   Return Current User
//@access PRIVATE
router.get(
  '/current', 
  passport.authenticate('jwt', {session: false}), 
  (req,res)=>{
    res.json({msg:req.user})
    }
)


module.exports = router;