const express = require("express");
const router = express.Router();

const path = require('path');
const fs = require('fs');
const directoryPath = process.cwd() + '/uploadedFiles/';//path.join(__dirname, 'Documents');

router.post("/download", (req, res) => {
  console.log("Route download called!");
  var filePath = req.body.paperPath;

  console.log("Download route filePath: " + filePath);
  var pathArr = filePath.split("/");
  var fileName = pathArr[pathArr.length - 1];
  console.log("Download route fileName: " + fileName);
  res.download(filePath, fileName);

});


router.get("/download/:paperHash", (req, res) => {
  console.log("Route Download with paperHash called!");
  var paperHash = req.params.paperHash;
  console.log("Download Route paperHash: " + paperHash);
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    var relevantFileName;
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        if(file.includes(paperHash)){
          console.log(file);
          res.download(directoryPath + file, file);
        }

    });
});
  /*var filePath = req.query.paperPath; ///Users/lucahernandezacosta/PowerFolders/powerfolder/Uni-Sachen/Project_Master/mern-auth/uploadedFiles/Peer_Review_BIG_new_ed65e0d2a550a98fd849f723c801e3ff4cff1919b55646184a50a3ca520daf5f.pdf

  console.log("Download route filePath: " + filePath);
  var pathArr = filePath.split("/");
  var fileName = pathArr[pathArr.length - 1];
  console.log("Download route fileName: " + fileName);
  res.download(filePath, fileName);*/

});

module.exports = router;
