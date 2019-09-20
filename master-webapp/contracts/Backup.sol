pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2;

contract PaperReviewHistory2 {
    //address payable owner;
    address owner;

    struct PaperReview {
        address paperAuthorAddress;
        string authorName;
        bytes32 paperHash; //paper can have multiple hashes, as there may be multiple review rounds and a chance for improving the paper and resubmitting
        bytes32 parentPaperHash; //
        bytes32[] paperHashHistory; //Only filled by root paper hash
        uint256[] paperTimestamps;
        address[] reviewerAddresses;
        string[] reviewerNames;
        bytes32[] reviewHashes;
        uint256[] reviewerTimestamps;
        int[] overallEvaluation;
        int[] reviewerConfidence;
    }

    mapping (bytes32 => PaperReview) public papers;

    bytes32[] public paperHashesOriginal; //Only the root paper hashes (the first ever submitted paper hashes)
    bytes32[] public paperHashesTotal; //All paper hashes including the improved ones for the next review round

    string[] public testStringArr = ["Hello World", "Hello Planet"];
    string public testString = "Hello World";
    bytes32 public testBytes = "Test Bytes";
    string[] public testArray= ["0xf77b889e6507e4f270e5ade94593d3da45e2197008292e058f30438c8e1abd55","0x50f1b68c23f346ebd27e954d205188a188bbfb161f7dbd53fbc4be7ebe8126ed"];

    function getPaperReviewHistory(bytes32 paperHash) view public returns (address, string memory, bytes32, bytes32, bytes32[] memory, uint256[] memory, address[] memory, string[] memory, bytes32[] memory, uint256[] memory, int[] memory, int[] memory ){//, string memory, bytes32, bytes32) {//, bytes32, uint256, address, string memory, bytes32, uint256, int8, int8) {
        bytes32 rootHash = getRootPaperHash(paperHash);
        return (papers[rootHash].paperAuthorAddress, papers[rootHash].authorName, papers[rootHash].paperHash, papers[rootHash].parentPaperHash, papers[rootHash].paperHashHistory, papers[rootHash].paperTimestamps, papers[rootHash].reviewerAddresses, papers[rootHash].reviewerNames, papers[rootHash].reviewHashes, papers[rootHash].reviewerTimestamps, papers[rootHash].overallEvaluation, papers[rootHash].reviewerConfidence);//, papers[rootHash].parentPaperHash);
    }

    function getPaperStruct(bytes32 paperHash) view public returns (PaperReview memory) {
      bytes32 rootHash = getRootPaperHash(paperHash);
      return papers[rootHash];
    }

    function getTestArray() view public returns (string[] memory) {
      return testArray;
    }

    function getTestString() view public returns (string memory) {
        return testString;
    }

    function getTestBytes() view public returns (bytes32) {
        return testBytes;
    }

    function getPaperHashesOriginal() view public returns (bytes32) {
        return paperHashesOriginal[0];
    }

    function getPaperHashesTotal() view public returns (bytes32) {
        return paperHashesTotal[0];
    }

    constructor() public {
        owner = msg.sender;
    }

    function setPaper(address _paperAuthorAddress, string memory _authorName, bytes32 _paperHash) public { // "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0", "Jon Doe", "0xca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"
        PaperReview storage paper = papers[_paperHash];
        paper.paperAuthorAddress = _paperAuthorAddress;
        paper.authorName = _authorName;
        paper.paperHash = _paperHash;
        paper.parentPaperHash = _paperHash;
        paper.paperHashHistory.push(_paperHash);
        paper.paperTimestamps.push(now);

        paperHashesOriginal.push(_paperHash);
        paperHashesTotal.push(_paperHash);
    }

     function updatePaper(bytes32 _oldPaperHash, bytes32 _newPaperHash) public {
        require(address(msg.sender) == papers[_oldPaperHash].paperAuthorAddress);
        PaperReview storage paper = papers[_newPaperHash];
        paper.paperAuthorAddress = papers[_oldPaperHash].paperAuthorAddress;
        paper.paperHash = _newPaperHash;
        paper.parentPaperHash = _oldPaperHash;
        papers[getRootPaperHash(_oldPaperHash)].paperHashHistory.push(_newPaperHash);
        paper.paperTimestamps.push(now);

        paperHashesTotal.push(_newPaperHash);
    }

    function getRootPaperHash(bytes32 _paperHash) public view returns (bytes32){
        bool flag = true;
        bytes32 rootHash = _paperHash;
        while(flag) {
            if(papers[rootHash].paperHash == papers[rootHash].parentPaperHash) {
                flag = false;
            } else {
                rootHash = papers[rootHash].parentPaperHash;
            }
        }

        return rootHash;

    }

    function setReview(bytes32 _paperHash, address _reviewerAddress, string memory _reviewerName, bytes32 _reviewHash, int _overallEvaluation, int _reviewerConfidence) public {
        papers[_paperHash].reviewerAddresses.push(_reviewerAddress);
        papers[_paperHash].reviewerNames.push(_reviewerName);
        papers[_paperHash].reviewHashes.push(_reviewHash);
        papers[_paperHash].reviewerTimestamps.push(now);
        papers[_paperHash].overallEvaluation.push(_overallEvaluation);
        papers[_paperHash].reviewerConfidence.push(_reviewerConfidence);
    }

    function countOriginalPapers() view public returns (uint) {
        return paperHashesOriginal.length;
    }

    function countTotalPapers() view public returns (uint) {
        return paperHashesTotal.length;
    }

    function getPaperHashesByAuthorWalletaddress(address _authurWalletAddress) view public returns (bytes32[] memory) {
        bytes32[] memory tmpHashesArray = new bytes32[](getNrOfPapersPublishedByAuthorWalletaddress(_authurWalletAddress));
        //delete tmpHashesArray;
        //bytes32[] memory tmpHashesArray;
        for (uint i=0; i<paperHashesTotal.length; i++) {
            if(papers[paperHashesTotal[i]].paperAuthorAddress == _authurWalletAddress){
                tmpHashesArray[i] = papers[paperHashesTotal[i]].paperHash;
                //tmpHashesArray.push(papers[paperHashesTotal[i]].paperHash);
            }
        }
        return tmpHashesArray;
    }

    function getNrOfPapersPublishedByAuthorWalletaddress(address _authurWalletAddress) view public returns (uint256 count) {  //Includes everything also updated papers
        uint256 counter = 0;
        for (uint i=0; i<paperHashesTotal.length; i++) {
            if(papers[paperHashesTotal[i]].paperAuthorAddress == _authurWalletAddress){
                counter ++;
            }
        }
        return counter;
    }

    /*function destroyMe() public {
        require(address(msg.sender) == owner);
        selfdestruct(owner);
    }*/

}
