const mongoose = require("mongoose");

const { Schema } = mongoose;

const FavoriteSchema = new Schema({

  School: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "schools",
  },
  UserData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

const Favorite = mongoose.model("Favorites", FavoriteSchema);
module.exports = Favorite;
