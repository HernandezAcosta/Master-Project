const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");




// Load input validation if needed


// Load Paper model
const Paper = require("../../models/Paper");

// @route POST api/papers/register
// @desc Register user
// @access Public
router.post("/save", (req, res) => {
  // Form validation

  console.log("req.body.firstName: " + req.body.firstName);
  console.log("req.body.file hash: " + req.body.file);



Paper.findOne({ paperHash: req.body.file }).then(paper => {
    if (paper) {
      console.log("Hash already exists! Entry will not be saved!");
      //res.write("Hash already exists!");
      return res.status(400).json({ paperHash: "paperHash already exists" });
    } else {


      const newPaperSubmission = new Paper({
        conferenceTitle: req.body.conferenceTitle,
        authorFirstName: req.body.firstName,
        authorLastName: req.body.lastName,
        authorEmail: req.body.email,
        authorWalletAddress: req.body.walletAddress,
        authorCountry: req.body.country,
        authorOrganization: req.body.organization,
        authorWebsite: req.body.website,
        title: req.body.title,
        abstract: req.body.abstract,
        keywords: req.body.keywords,
        paperHash: req.body.file,
        paperPath: req.body.paperPath
      });

      newPaperSubmission.save().then(paper => res.status(400).json({ paperHash: req.body.file, info: "Document saved!"})).catch(err => console.log(err));
      //return res.status(400).json({ paperHash: req.body.file, info: "Document saved!"});
    }
  });
});

// @route POST api/papers/add
// @desc add papers
// @access Public
router.post("/add", (req, res) => {
  let paper = new Paper(req.body);

  paper.save()
    .then(paper => {
      res.status(200).json({'paper': 'paper added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });

});

/* UPDATE Paper */
router.post("/elementUpdate/:id", (req, res) => {
  console.log("Update id: " + req.params.id);
  Paper.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return err;
    res.status(200).json({ info: "Element Updated", paperHash: req.body.paperHash });
  });
});


// @route GET api/papers/getAll
// @desc get all papers
// @access Public
router.get("/getAll", (req, res) => {

  Paper.find(function(err, papers){
      if(err){
        console.log(err);
      }
      else {
        res.json(papers);
      }
    });

});

// @route GET api/papers/getByID
// @desc get papers by Id
// @access Public
router.get("/getAllByWalletAddress/:walletAddress", (req, res) => {
  console.log("req: " + req.param.walletAddress); //0x64E078A8Aa15A41B85890265648e965De686bAE6
  let walletAddress = req.params.walletAddress;
  var userPapers = [];
  Paper.find(function(err, papers){
      if(err){
        console.log(err);
      }
      else {
        console.log("getAllByWalletAddress papers.length: " + papers.length);
        for (var i = 0; i < papers.length; i++) {
          if(papers[i].authorWalletAddress === walletAddress) {
            console.log("getAllByWalletAddress papers belongs to : " + walletAddress);
            userPapers.push(papers[i]);
            console.log("getAllByWalletAddress userPapers.length: " + userPapers.length);
          }
        }

        res.json(userPapers);
      }
    });

});

// @route GET api/papers/getByID
// @desc get papers by Id
// @access Public
router.get("/getById/:id", (req, res) => {
  console.log("req: " + req.param.id);
  let id = req.params.id;
  Paper.findById(id, function (err, paper){
      res.json(paper);
  });

});



// @route GET api/papers/getByID
// @desc get papers by Id
// @access Public
router.get("/getByID", (req, res) => {
  console.log("req: " + req.body._id);
  let id = req.body._id;
  Paper.findById(id, function (err, paper){
      res.json(paper);
  });

});

// Defined delete | remove | destroy route
router.get("/delete/:id", (req, res) => {
  console.log("req: " + req.params.id);
  let id = req.params.id;
  Paper.findByIdAndRemove(id, { useFindAndModify: false }, function (err, paper){
      if(err){
        res.json(err);
      }
      else{
         paper == null ? res.json('Paper was already successfully removed') : res.json(paper.title + ' was Successfully removed')
        //res.json(paper.title + ' Was Successfully removed');
      }
  });

});

router.get("/deleteAll/:pass", (req, res) => {
  console.log("req: " + req.params.pass);
  let pass = req.params.pass;
  if(pass === "removeAll"){

    Paper.find(function(err, papers){
        if(err){
          console.log(err);
        }
        else {
          for(var i = 0; i < papers.length; i++){
            Paper.findByIdAndRemove(papers[i].id, { useFindAndModify: false }, function (err, paper){
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
