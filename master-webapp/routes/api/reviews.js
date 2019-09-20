const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const crypto = require('crypto');
const util = require('util')





// Load input validation if needed


// Load Review model
const Review = require("../../models/Review");

// @route POST api/papers/register
// @desc Register user
// @access Public
router.post("/save", (req, res) => {
  // Form validation
  console.log("reviews req: " + util.inspect(req, false, 1, true /* enable colors */))

  console.log("req.body.firstName: " + req.body.firstName);
  console.log("req.body.review: " + req.body.review);

  var crypto = require('crypto');

  // change to 'md5' if you want an MD5 hash
  var hash = crypto.createHash('sha256');

  // change to 'binary' if you want a binary hash.
  hash.setEncoding('hex');

  // the text that you want to hash
  hash.write(req.body.review);

  // very important! You cannot read from the stream until you have called end()
  hash.end();

  // and now you get the resulting hash
  var reviewHash = hash.read();

  // and now you get the resulting hash
  /*var sha1sum = hash.read();

  var reviewHash   = crypto.createHash('sha256')
   .update(req.body.review)
   .digest('hex');*/

  console.log("reviewHash: " + reviewHash);

  Review.findOne({ reviewHash: reviewHash }).then(review => {
    if (review) {
      console.log("Hash already exists! Entry will not be saved!");
      return res.status(400).json({ reviewHash: "reviewHash already exists" });
    } else {


      const newReviewSubmission = new Review({
        reviewerFirstName: req.body.firstName,
        reviewerLastName: req.body.lastName,
        reviewerEmail: req.body.email,
        reviewerWalletAddress: req.body.walletAddress,
        reviewerCountry: req.body.country,
        reviewerOrganization: req.body.organization,
        reviewerWebsite: req.body.website,
        titleOfPaper: req.body.title,
        hashOfPaper: req.body.hashOfPaper,
        authorOfPaper: req.body.authorOfPaper,
        pcMembers: req.body.pcMembers,
        overallEvaluation: req.body.overallEvaluation,
        reviewerConfidence: req.body.reviewerConfidence,
        review: req.body.review,
        reviewRemarks: req.body.reviewRemarks,
        reviewHash: reviewHash
      });

      newReviewSubmission.save().then(review => res.status(400).json({ reviewHash: reviewHash, info: "Document saved!" })).catch(err => console.log(err));
      //return res.status(400).json({ reviewHash: reviewHash, info: "Document saved!" });

    }
  });
});

// @route POST api/reviews/add
// @desc add reviews
// @access Public
router.post("/add", (req, res) => {
  let review = new Review(req.body);

  review.save()
    .then(review => {
      res.status(200).json({'review': 'review added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });

});

/* UPDATE Review */
router.post("/elementUpdate/:id", (req, res) => {
  console.log("Update id: " + req.params.id);
  Review.findByIdAndUpdate(req.params.id, req.body, function (err, review) {
    if (err) return err;
    res.json(review);
  });
});

// @route GET api/reviews/getAll
// @desc get all reviews
// @access Public
router.get("/getAll", (req, res) => {

  Review.find(function(err, reviews){
      if(err){
        console.log(err);
      }
      else {
        res.json(reviews);
      }
    });

});

// @route GET api/reviews/getByID
// @desc get reviews by Id
// @access Public
router.get("/getById/:id", (req, res) => {
  console.log("req: " + req.param.id);
  let id = req.params.id;
  Review.findById(id, function (err, review){
      res.json(review);
  });

});

// @route GET api/papers/getByID
// @desc get papers by Id
// @access Public
router.get("/getAllByHashOfPaper/:hashOfPaper", (req, res) => {
  console.log("req: " + req.param.hashOfPaper); //0x64E078A8Aa15A41B85890265648e965De686bAE6
  let hashOfPaper = req.params.hashOfPaper;
  var paperReviews = [];
  Review.find(function(err, reviews){
      if(err){
        console.log(err);
      }
      else {
        console.log("getAllByHashOfPaper reviews.length: " + reviews.length);
        for (var i = 0; i < reviews.length; i++) {
          if(reviews[i].hashOfPaper === hashOfPaper) {
            console.log("getAllByHashOfPaper reviews belongs to : " + hashOfPaper);
            paperReviews.push(reviews[i]);
            console.log("getAllByHashOfPaper paperReviews.length: " + paperReviews.length);
          }
        }

        res.json(paperReviews);
      }
    });

});

// @route GET api/reviews/getByID
// @desc get reviews by Id
// @access Public
router.get("/getByID", (req, res) => {
  console.log("req: " + req.body._id);
  let id = req.body._id;
  Review.findById(id, function (err, review){
      res.json(review);
  });

});

// Defined delete | remove | destroy route
router.get("/delete/:id", (req, res) => {
  console.log("req: " + req.params.id);
  let id = req.params.id;
  Review.findByIdAndRemove(id, { useFindAndModify: false }, function (err, review){
      if(err){
        res.json(err);
      }
      else{
         review == null ? res.json('Review was already successfully removed') : res.json(review.title + ' was Successfully removed')
        //res.json(review.title + ' Was Successfully removed');
      }
  });

});

router.get("/deleteAll/:pass", (req, res) => {
  console.log("req: " + req.params.pass);
  let pass = req.params.pass;
  if(pass === "removeAll"){

    Review.find(function(err, reviews){
        if(err){
          console.log(err);
        }
        else {
          for(var i = 0; i < reviews.length; i++){
            Review.findByIdAndRemove(reviews[i].id, { useFindAndModify: false }, function (err, review){
                if(err){
                  res.json(err);
                }
                else{
                  //res.json(paper.title + ' Was Successfully removed');
                }
            });
          }


        }
      });

    res.json('All Documents successfully removed');
  }

});



module.exports = router;
