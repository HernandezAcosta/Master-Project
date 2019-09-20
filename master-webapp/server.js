const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const upload = require('./upload');
const download = require('./download');
const cors = require('cors');

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}


const users = require("./routes/api/users");
const papers = require("./routes/api/papers");
const reviews = require("./routes/api/reviews");
const conferences = require("./routes/api/conferences");
const downloads = require("./routes/api/downloads");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/papers", papers);
app.use("/api/reviews", reviews);
app.use("/api/conferences", conferences);
app.use("/api/downloads", downloads);

app.use(cors(corsOptions))

app.post('/upload', upload)
//app.post('/download', download)

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there

app.listen(port, () => console.log(`Server is up and running on port ${port} !`));
