const express = require('express');
const{authcheck} =require('../middleware/auth-check')
const router=express.Router();

router.get('/currency',authcheck,(req, res) =>{

});
module.exports=router;