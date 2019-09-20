const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load User model
const Conference = require("../../models/Conference");

// @route POST api/conferences/add
// @desc add conferences
// @access Public
router.post("/add", (req, res) => {
  let conference = new Conference(req.body);

  conference.save()
    .then(conference => {
      res.status(200).json({'conference': 'conference added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });

});

router.post("/save", (req, res) => {
  let conference = new Conference(req.body);

  conference.save()
    .then(conference => {
      res.status(200).json({'conference': 'conference added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });

});

// @route GET api/conferences/getAll
// @desc get all conferences
// @access Public
router.get("/getAll", (req, res) => {

  Conference.find(function(err, conferences){
      if(err){
        console.log(err);
      }
      else {
        res.json(conferences);
      }
    });

});

// @route GET api/conferences/getByID
// @desc get conferences by Id
// @access Public
router.get("/getById/:id", (req, res) => {
  console.log("req: " + req.param.id);
  let id = req.params.id;
  Conference.findById(id, function (err, conference){
      res.json(conference);
  });

});

// @route GET api/conferences/getByID
// @desc get conferences by Id
// @access Public
router.get("/getByID", (req, res) => {
  console.log("req: " + req.body._id);
  let id = req.body._id;
  User.findById(id, function (err, conference){
      res.json(conference);
  });

});

// Defined delete | remove | destroy route
router.get("/delete/:id", (req, res) => {
  console.log("req: " + req.params.id);
  let id = req.params.id;
  Conference.findByIdAndRemove(id, function (err, conference){
      if(err) res.json(err);
      else res.json(conferences.name + ' Was Successfully removed');
  });

});


module.exports = router;
