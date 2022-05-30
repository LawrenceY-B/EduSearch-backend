const express = require('express');
const router=express.Router();

router.get('/transfer',(req, res, next) =>{
console.log('tranfer is running')
res.send('<h1>Transfer</h1>')
});
module.exports=router;