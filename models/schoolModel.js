const mongoose = require('mongoose');

const { Schema } = mongoose;

const schoolSchema = new Schema({
    id: Number,
    name: String,
    curriculum: String,
    level:String,
    size:Number,
    price: Number,
    Location: String,
    Rating: Number,
    ImgUrl: String,
  });
  
  const Sch= mongoose.model('Schools', schoolSchema);
  module.exports = Sch;