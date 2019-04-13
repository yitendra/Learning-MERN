const express = require('express');
const router = express.Router();

// router.get('/test',(req,res)=>{res.json({msg:"API"})})
router.get('/test',(req,res)=>res.send('something'))

module.exports = router;