const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  currentRole: {
    type: String,
    default:"author"
  },
  numberOfRatings: {
    type: Number,
    default: 0,
    required: false
  },
  trustedReviewerPercentage: {
    type: Number,
    default: 0,
    required: false
  },
  roles: {
    type: String,
    default:"author, reviewer, editor"
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
