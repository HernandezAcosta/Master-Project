const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

const { errors, isValid } = validateRegisterInput(req.body);

// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {

      User.findOne({ walletAddress: req.body.walletAddress }).then(user => {
          if (user) {
            return res.status(400).json({ walletAddress: "Wallet Address already exists" });
          } else {

            const newUser = new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              walletAddress: req.body.walletAddress,
              currentRole: req.body.currentRole,
              password: req.body.password
            });

            // Hash password before saving in database
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
              });
            });

          }
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

const { errors, isValid } = validateLoginInput(req.body);

// Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

const email = req.body.email;
const password = req.body.password;
console.log("email: " + email);
console.log("password: " + password);

// Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

// Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.firstName,
          currentRole: user.currentRole,
          trustedReviewerPercentage: user.trustedReviewerPercentage,
          walletAddress: user.walletAddress,
          email: user.email
        };

// Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// @route GET api/users/getAll
// @desc get all users
// @access Public
router.get("/getAll", (req, res) => {

  User.find(function(err, users){
      if(err){
        console.log(err);
      }
      else {
        res.json(users);
      }
    });

});

// @route GET api/users/getByID
// @desc get users by Id
// @access Public
router.get("/getById/:id", (req, res) => {
  console.log("req: " + req.param.id);
  let id = req.params.id;
  User.findById(id, function (err, user){
      res.json(user);
  });

});

// @route GET api/users/getByID
// @desc get users by Id
// @access Public
router.get("/getByID", (req, res) => {
  console.log("req: " + req.body._id);
  let id = req.body._id;
  User.findById(id, function (err, user){
      res.json(user);
  });

});

// Defined delete | remove | destroy route
router.get("/delete/:id", (req, res) => {
  console.log("req: " + req.params.id);
  let id = req.params.id;
  User.findByIdAndRemove(id, function (err, user){
      if(err){
         res.json(err);
       }
      else{
         user === null ? res.json('User was already successfully removed') : res.json(user.name  + ' was Successfully removed')
       }
  });

});

router.get("/deleteAll/:pass", (req, res) => {
  console.log("req: " + req.params.pass);
  let pass = req.params.pass;
  if(pass === "removeAll"){

    User.find(function(err, users){
        if(err){
          console.log(err);
        }
        else {
          for(var i = 0; i < users.length; i++){
            User.findByIdAndRemove(users[i].id, { useFindAndModify: false }, function (err, user){
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

    res.json('All Users successfully removed');
  }

});

// @route GET api/users/getAllByWalletAddress
// @desc get users by getAllByWalletAddress
// @access Public
router.get("/getByWalletAddress/:walletAddress", (req, res) => {
  console.log("req: " + req.param.walletAddress); //0x64E078A8Aa15A41B85890265648e965De686bAE6
  let walletAddress = req.params.walletAddress;
  var user = "";
  User.find(function(err, users){
      if(err){
        console.log(err);
      }
      else {
        console.log("getByWalletAddress users.length: " + users.length);
        for (var i = 0; i < users.length; i++) {
          if(users[i].walletAddress === walletAddress) {
            user = users[i];
          }
        }

        res.json(user);
      }
    });

});

/* UPDATE User */
router.post("/elementUpdate/:id", (req, res) => {
  console.log("User Update id: " + req.params.id);
  console.log("User Update currentRole: " + req.body.currentRole);
  User.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return err;


    const payload = {
      id: post.id,
      name: post.firstName,
      currentRole: req.body.currentRole,
      walletAddress: post.walletAddress,
      numberOfRatings: post.numberOfRatings,
      trustedReviewerPercentage: post.trustedReviewerPercentage,
      email: post.email
    };

    // Sign token
      jwt.sign(
        payload,
        keys.secretOrKey,
        {
          expiresIn: 31556926 // 1 year in seconds
        },
        (err, token) => {
          res.status(200).json({ success: true, token: "Bearer " + token, info: "Element Updated", currentRole: req.body.currentRole });
          /*res.json({
            success: true,
            token: "Bearer " + token
          });*/
        }
      );


  });
});


module.exports = router;
