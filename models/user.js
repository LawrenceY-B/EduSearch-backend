const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  Name: { type: String, required: true },
  Password: { type: String, required: true },
  Phonenumber: { type: Number, required: true },
  Email: { type: String,  required: true },
  isVerified: { type: Boolean, default: false },
  FavoriteSchools: [ {type: mongoose.Schema.Types.ObjectId, ref: "Favorites",}],
  ImgUrl: { type: String },
  
});


const User = mongoose.model("Users", UserSchema);

module.exports = User;
