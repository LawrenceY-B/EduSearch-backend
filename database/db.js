require ('dotenv').config()
const url = process.env.MONGODB
const mongoose = require('mongoose');
             mongoose.connect
            (
              "mongodb+srv://larry:mamamia@cluster0.voe6t.mongodb.net/User?retryWrites=true", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(()=>{
          console.log('MongoDB connected!!');
        }) 
        .catch ((err)=> {
        console.log('Failed to connect to MongoDB', err);  })
  