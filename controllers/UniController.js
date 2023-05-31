const universityModel = require('../models/university')
const jwt = require('jsonwebtoken')
 
const Addnewuniversity = async(req,res)=>{
    const {error}= validateuni(req.body)
    if(error) return res.status(400).json({success: false, message: error.message})
const { name, location, website, address, phone, email} = req.body
const Phonenumber = phone.replace(phone.slice(0, 1), "233");
const result = await universityModel.create(
    name
)

}

const Addcourses = async(req,res)=>{}

module.exports={Addnewuniversity, Addcourses}
