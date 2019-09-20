const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ReviewSchema = new Schema({
  reviewerFirstName: {
    type: String,
    required: true
  },
  reviewerLastName: {
    type: String,
    required: true
  },
  reviewerEmail: {
    type: String,
    required: true
  },
  reviewerWalletAddress: {
    type: String,
    required: true
  },
  reviewerCountry: {
    type: String,
    required: true
  },
  reviewerOrganization: {
    type: String,
    required: true
  },
  reviewerWebsite: {
    type: String,
    required: true
  },
  titleOfPaper: {
    type: String,
    required: true
  },
  hashOfPaper: {
    type: String,
    required: true
  },
  authorOfPaper: {
    type: String,
    required: true
  },
  pcMembers: {
    type: String,
    required: true
  },
  overallEvaluation: {
    type: String,
    required: true
  },
  reviewerConfidence: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  reviewRemarks: {
    type: String,
    required: true
  },
  reviewHash: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Review = mongoose.model("reviews", ReviewSchema);
