require ('dotenv').config()
const url = process.env.MONGODB_URI
const mongoose = require('mongoose');
             mongoose.connect
            (
              `${url}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(()=>{
          console.log('MongoDB connected!!');
        }) 
        .catch ((err)=> {
        console.log('Failed to connect to MongoDB', err);  })
  