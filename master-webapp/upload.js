const IncomingForm = require('formidable').IncomingForm
const ipfsUpload = require('./ipfsUpload')
var fs = require('fs');
var Sync = require('sync');
const util = require('util');
const { exec } = require('child_process');

var checkSum;



const myDateTime = require('./myDateTime')

module.exports = function upload(req, res) {
  //console.log("req Obj: " + util.inspect(req, {showHidden: false, depth: null}))

  // alternative shortcut
  console.log("req Obj2: " + util.inspect(req.socket._events.data, false, 1, true /* enable colors */))

  console.log("req file: " + req.file);

  var form = new IncomingForm()

  form.on('file', (field, file) => {
    // Do something with the file
    // e.g. save it to the database
    // you can access it using file.path
    /**var oldpath = file.path;
    var newpath = '/Users/lucahernandezacosta/PowerFolders/powerfolder/Uni-Sachen/Project_Master/webpack_tutorial/drizzle_react/drizzle-react-tutorial/server/uploadedFiles' + files.filetoupload.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.write('File uploaded and moved!');
      res.end();
    });**/

    console.log("upload.js");

    var oldpath = file.path;
    console.log("field: " + field);
    console.log("typeof field: " + typeof (field));
    console.log("field.file: " + JSON.stringify(field.file));
    console.log("field JSON: " + JSON.stringify(field.file));
    console.log("field OBJ: " + util.inspect(field.file, false, 1, true /* enable colors */))
    console.log("file: " + file);
    console.log("typeof file: " + typeof file);
    console.log("file JSON: " + JSON.stringify(file));


    var crypto = require('crypto');

    // the file you want to get the hash
    var fd = fs.createReadStream(oldpath);
    //var fd = fs.openSync(oldpath);
    var hash = crypto.createHash('sha256');
    hash.setEncoding('hex');
    //var checkSum;

    console.log("hash.read(): " + hash.read());

    fd.on('end', function() {
          console.log("Call from on()!")
          hash.end();
          checkSum = hash.read();
          //console.log("Calculated hash: " + checkSum); // the desired sha256sum

          var fileNameArr = file.name.replace(".pdf", "");//.split(".");
          var newFileName = fileNameArr + "_" + checkSum + ".pdf";
          var newpath = process.cwd() + '/uploadedFiles/' + newFileName;


          //console.log(oldpath);
          //console.log(newpath);
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            //res.write('File uploaded and moved! Hash of File: ' + checkSum);
            //res.end();
            exec('ipfs add --only-hash ' + newpath, (err, stdout, stderr) => {
              if (err) {
                // node couldn't execute the command
                console.log("Error occurred: " + err);
                return;
              }

              var array = stdout.split("\n");
              var firstIndex = array[0];
              ipfsHash = firstIndex.split(" ")[1];
              console.log("ipfsHash: " + ipfsHash);

              // the *entire* stdout and stderr (buffered)
              console.log(`stdout: ${stdout}`);
              console.log(`stderr: ${stderr}`);
              var newpathWithIpfsHash = process.cwd() + '/uploadedFiles/' + fileNameArr + "_" + ipfsHash + ".pdf";

              fs.rename(newpath, newpathWithIpfsHash, function (err) {
                if (err) throw err;
                console.log("ipfsHash: " + ipfsHash);
                res.write("CheckSum:" + ipfsHash + ";paperPath:" + newpathWithIpfsHash);
                res.end();

                ipfsUpload.ipfsUpload();

              })



            });
          });




      })

    // read all file and pipe it (write it) to the hash object
    fd.pipe(hash);






  })
  form.on('end', () => {
    //res.json()

  })
  form.parse(req)
}
