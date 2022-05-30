const express = require('express');
const{authcheck} =require('../middleware/auth-check')
const router=express.Router();

router.get('/currency',authcheck,(req, res) =>{
console.log('Currency is running')
res.status(200).json({message:'Page unavailable'})
});
module.exports=router;