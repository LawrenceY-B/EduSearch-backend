const mongoose = require("mongoose");

const { Schema } = mongoose;

const FavSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  School: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schools",
  },
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

const Fav = mongoose.model("Favorites", FavSchema);
module.exports = Fav;
