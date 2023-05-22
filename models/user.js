const { object } = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  FirstName: { type: String },
  LastName: { type: String },
  Password: { type: String },
  Phonenumber: { type: Number },
  Email: { type: String },
  isVerified: { type: Boolean },
  FavoriteSchools: [ {type: mongoose.Schema.Types.ObjectId, ref: "Favorites",}],
  
});


const User = mongoose.model("Users", UserSchema);

module.exports = User;
