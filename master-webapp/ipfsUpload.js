const { exec } = require('child_process');
var parentFolderHash;

exports.ipfsUpload = function () {
  console.log("IPFSUpload in Root folder");

  exec('cd uploadedFiles && ipfs add -r .', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    var array = stdout.split("\n");
    var lastIndex = array[array.length - 2];
    parentFolderHash = lastIndex.split(" ")[1];
    console.log("parentFolderHash: " + parentFolderHash);

    console.log(`stdout:\n ${stdout}`);
    console.log(`stderr: ${stderr}`);

  });

};
