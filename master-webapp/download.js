const util = require('util')



module.exports = function download(req, res) {
  //console.log("Download req!!!!!!!!: " + util.inspect(req, {showHidden: false, depth: 1}));
  //console.log("Req body!!!!!!!!!: " + util.inspect(req.body, {showHidden: false, depth: 1}));
  const file =  req.body.paperPath;//`${__dirname}/upload-folder/dramaticpenguin.MOV`;

  //res.setHeader('Content-Type', 'application/pdf');
  //res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
  res.download(file); // Set disposition and send it.


}
