const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  Name: { type: String },
  Password: { type: String },
  Phonenumber: { type: Number },
  Email: { type: String },
  isVerified: { type: Boolean },
  FavoriteSchools: [ {type: mongoose.Schema.Types.ObjectId, ref: "Favorites",}],
  SearchHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Search" }],

  
});


const User = mongoose.model("Users", UserSchema);

module.exports = User;
