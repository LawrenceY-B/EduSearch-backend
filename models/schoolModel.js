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
    isSaved: Boolean,
  });
  
  const Sch= mongoose.model('Schools', schoolSchema);
  module.exports = Sch;