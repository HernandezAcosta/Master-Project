const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const PaperSchema = new Schema({
  conferenceTitle: {
    type: String,
    required: true
  },
  authorFirstName: {
    type: String,
    required: true
  },
  authorLastName: {
    type: String,
    required: true
  },
  authorEmail: {
    type: String,
    required: true
  },
  authorWalletAddress: {
    type: String,
    required: true
  },
  authorCountry: {
    type: String,
    required: true
  },
  authorOrganization: {
    type: String,
    required: true
  },
  authorWebsite: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  abstract: {
    type: String,
    required: true
  },
  keywords: {
    type: String,
    required: true
  },
  paperHash: {
    type: String,
    required: true
  },
  paperPath: {
    type: String,
    required: true
  },
  publishState: {
    type: Boolean,
    default: false,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Paper = mongoose.model("papers", PaperSchema);
