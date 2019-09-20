const IncomingForm = require('formidable').IncomingForm
var fs = require('fs');

module.exports = function upload(req, res) {
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

    var oldpath = file.path;
    var newpath = '/Users/lucahernandezacosta/PowerFolders/powerfolder/Uni-Sachen/Project_Master/webpack_tutorial/drizzle_react/drizzle-react-tutorial/server/uploadedFiles/' + file.name;
    console.log(oldpath);
    console.log(newpath);
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      //res.write('File uploaded and moved!');
      //res.end();
    });
  })
  form.on('end', () => {
    res.json()
  })
  form.parse(req)
}
