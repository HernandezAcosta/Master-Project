const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ConferenceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  papers: {
    type: [String],
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Conference = mongoose.model("conferences", ConferenceSchema);
