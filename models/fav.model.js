const mongoose = require('mongoose');

const { Schema } = mongoose;

const FavSchema = new Schema({
    id: Number,
    name: String,
    Location: String,
    Rating: Number,
    ImgUrl: String,
    isSaved: Boolean,
  });
  
  const Fav= mongoose.model('Favorites', FavSchema);
  module.exports = Fav;