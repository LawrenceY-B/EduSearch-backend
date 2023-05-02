const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String, required: true },
    Password: { type: String, required: true },
    Phonenumber: { type: Number, required: true },
    Email: { type: String, required: true },
    Favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Schools",
      },
    ],
    token: { type: String },
  },

  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
