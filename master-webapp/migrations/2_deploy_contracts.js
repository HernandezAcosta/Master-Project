const Addition = artifacts.require("Addition");
const MyStringStore = artifacts.require("MyStringStore");
const PaperReviewHistory = artifacts.require("PaperReviewHistory");

module.exports = function(deployer) {
  deployer.deploy(Addition);
  deployer.deploy(MyStringStore);
  deployer.deploy(PaperReviewHistory);
};
