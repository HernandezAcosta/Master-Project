import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios from 'axios';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { savePaper } from "../../actions/saveActions";
import { Link, withRouter } from "react-router-dom";
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Moment from 'react-moment';
import '../../App.css';
import bs58 from "bs58";




export class SearchResultModal extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      dataKey: null,
      dataKeys: [],
      papers: [],
      reviews: [],
      reviewQualityPercentage: "",
      users: []
    }


  }



  componentDidMount() {
    console.log("SearchResultModal did mount");

    axios.get(`/api/papers/getAll`)
      .then(res => {
        console.log("SearchResultModal Axios get Papers: " + res.data);
        const papers = res.data;
        console.log("SearchResultModal did Mount props: " + this.props);

        var { drizzle } = this.props;
        var contract = drizzle.contracts.PaperReviewHistory;

        for(var i = 0; i < papers.length; i++){
          const bytes2 = bs58.decode(papers[i].paperHash);
          console.log("SearchResultModal Decoded in HEX: " + bytes2.toString('hex'));
          var convertedHashForContract = bytes2.toString('hex').slice(4);

          this.state.dataKeys.push(contract.methods.getPaperReviewHistory.cacheCall("0x" + convertedHashForContract));

        }

        this.setState({ papers });

      })

      axios.get(`/api/reviews/getAll`)
        .then(res => {
          console.log("Navbar Axios get Reviews: " + res.data);
          const reviews = res.data;
          this.setState({ reviews });

        })

      axios.get(`/api/users/getAll`)
        .then(res => {
          console.log("Navbar Axios get Users: " + res.data);
          const users = res.data;
          this.setState({ users });

        })

        axios.get(`/api/users/getByWalletAddress/` + this.props.selectedUserWalletAddress)
          .then(res => {

            const user = res.data;
            var numberOfRatings = user.numberOfRatings;
            var trustedReviewerPercentage = user.trustedReviewerPercentage;

            var percentage = trustedReviewerPercentage / numberOfRatings;
            if(isNaN(percentage)) {
              percentage = 0;
            }

            this.setState({reviewQualityPercentage: percentage});

          })





  }

  componenDidUpdate() {
    console.log("SearchResultModal did Update props: " + this.props);
  }




  render() {

    // get the contract state from drizzleState
    var { PaperReviewHistory } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    //var testString = PaperReviewHistory.getPaperReviewHistory[this.state.dataKey];
    var testStrings = [];

    //var testString = PaperReviewHistory.getPaperReviewHistory[this.state.dataKeys[this.props.currentPaperIndex]];

    console.log("SearchResultModal dataKeys.length: " + this.state.dataKeys.length);

    for (var i = 0; i < this.state.dataKeys.length; i++) {
      testStrings.push(PaperReviewHistory.getPaperReviewHistory[this.state.dataKeys[i]]);
    }

    //var reviewerAddresses = JSON.stringify(testString).values[6];

    //console.log("SearchResultModal getPaperReviewHistory raw testString: " + testString[0].args);
    console.log("SearchResultModal getPaperReviewHistory: " + JSON.stringify(testStrings));
    let contractPaperReviewHashes = [];
    let dataObjs = [];
    let dataObj = [];

    for (var i = 0; i < testStrings.length; i++){
      var testString = testStrings[i];

      for (var property in testString) {
          if (testString.hasOwnProperty(property)) {
              // do stuff
              if(property === "value"){
                console.log("SearchResultModal Object property:",property);
                console.log("SearchResultModal Object value:",testString[property]);
                contractPaperReviewHashes = testString[property][6];
                dataObj = testString[property];
                console.log("SearchResultModal Object value 6th:",testString[property][6]);
              }

          }
        }
        dataObjs.push(dataObj);
      }

      {
        console.log("SearchResultModal dataObjs length: " + dataObjs.length);
        console.log("SearchResultModal this.state.papers.length: " + this.state.papers.length);

        if(dataObjs.length !== this.state.papers.length || this.state.papers.length === 0 ){ // Only proceed with execution when all important contract data is loaded into dataObjs
          return <div>Loading...</div>
        }
      }


    console.log("SearchResultModal this.props.selectedUserWalletAddress: " + this.props.selectedUserWalletAddress);
    console.log("SearchResultModal Object getPaperReviewHistory contractPaperReviewHashes: " + JSON.stringify(contractPaperReviewHashes));

    console.log("SearchResultModal Object getPaperReviewHistory dataObjs: " + JSON.stringify(dataObjs));
    console.log("SearchResultModal Object getPaperReviewHistory dataObjs length: " + dataObjs.length);
    //console.log("SearchResultModal Object getPaperReviewHistory dataObjs[0]: " + JSON.stringify(dataObjs[0]));
    //console.log("SearchResultModal Object getPaperReviewHistory dataObjs[0]: " + dataObjs[0]);
    //console.log("SearchResultModal Object getPaperReviewHistory dataObjs[3][9]: " + dataObjs[3][9]);
    //console.log("SearchResultModal Object getPaperReviewHistory dataObjs[9]: " + JSON.stringify(dataObjs[0][9]));

    console.log("SearchResultModal Object getPaperReviewHistory dataObj: " + JSON.stringify(dataObj));
    //console.log("SearchResultModal Object getPaperReviewHistory dataObj[9]: " + dataObj[9]);
    let hasNoPapers = true;




    return (
      <Modal
        {...this.props}
        size="lg"
        dialogClassName="timeLineModal"
        aria-labelledby="contained-modal-title-vcenter"
        centered

      >
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter">
            Review Quality Percentage {this.state.reviewQualityPercentage}%.  All papers submitted by {this.state.users.map((user, index) => {
              {
                if (user.walletAddress === this.props.selectedUserWalletAddress) {
                  return user.firstName + " " + user.lastName
                }
              }
            })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>



        <VerticalTimeline>

          {this.state.papers.map((paper, index) => {
            {
              const bytes2 = bs58.decode(paper.paperHash);
              console.log("SearchResultModal Decoded in HEX: " + bytes2.toString('hex'));
              var convertedHashForContract = bytes2.toString('hex');
              convertedHashForContract ="0x" + convertedHashForContract.slice(4);
              console.log("SearchResultModal Decoded convertedHashForContract: " + convertedHashForContract);
              //console.log("SearchResultModal Decoded dataObjs[2]: " + dataObjs[index][2]);

              if((convertedHashForContract) === dataObjs[index][2] && paper.authorWalletAddress === this.props.selectedUserWalletAddress){
                {hasNoPapers = false}
                return <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date={new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format((dataObjs[index][5][0] * 1000))}  //dataObj[8][index]
                    iconStyle={{ background: 'rgb(33, 243, 173)', color: '#fff' }}
                  >
                    <h3 className="vertical-timeline-element-title">{paper.title ? paper.title : "Paper has no title!"}</h3>
                    <h4 className="vertical-timeline-element-title">Paper submitted by {paper.authorFirstName} {paper.authorLastName}</h4>
                    <p>Author Wallet Address:</p>
                    <p className="vertical-timeline-element-subtitle">{paper.authorWalletAddress}</p>
                    <p>Abstract:</p>
                    <p>{paper.abstract ? paper.abstract : "Sample Abstract" }</p>
                    <p>Overall Evaluation:</p>
                    <p>{dataObjs[index][9].join() ? dataObjs[index][9].join() : "No Reviews untill now" }</p>
                    <p>Publish state:</p>
                    <p>{paper.publishState ? "Published" : "Not Published"}</p>
                    <p>Hash of Paper:</p>
                    <p><a href={'https://ipfs.io/ipfs/' + paper.paperHash}>{paper.paperHash}</a></p>
                  </VerticalTimelineElement>

              }

            }
          })}

          <div>
            { hasNoPapers
              ? <h1> Has currently no Papers </h1>
              : ""
            }
          </div>



          {/*}{this.props.userPaperReviews.map((review, index) => {
            {
            const bytes2_2 = bs58.decode(review.hashOfPaper);
            console.log("SearchResultModal Decoded reviews in HEX: " + bytes2_2.toString('hex'));
            var convertedHashForContract = bytes2_2.toString('hex');
            convertedHashForContract ="0x" + convertedHashForContract.slice(4);
            console.log("SearchResultModal Decoded reviews convertedHashForContract: " + convertedHashForContract);
            console.log("SearchResultModal Decoded reviews dataObj[2]: " + dataObj[2]);
            if(convertedHashForContract === dataObj[2]){
              console.log("SearchResultModal its true true: " + review.hashOfPaper + " " + dataObj[2]);
              console.log("SearchResultModal timestamp: " + Date.now());
              console.log("SearchResultModal counter: " + counter);
              return <VerticalTimelineElement
                  className="vertical-timeline-element--work"
                  date={new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format((dataObj[8][counter] * 1000))}  //dataObj[8][index]
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                >
                  <h3 className="vertical-timeline-element-title">{counter + 1}. Review by {review.reviewerFirstName}</h3>
                  <p>Reviewer Wallet Address:</p>
                  <p className="vertical-timeline-element-subtitle">{review.reviewerWalletAddress}</p>
                  <p>Review:</p>
                  <p>{review.review ? review.review : "Sample Review" }</p>
                  <p>Hash of Review:</p>
                  <p>{review.reviewHash}</p>
                  <p>Overall overall Evaluation:</p>
                  <p>{review.overallEvaluation}</p>
                  <p id="hideCounter">{counter = counter + 1}</p>
                </VerticalTimelineElement>

            }

            }

          })}*/}


          {/*<VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="2011 - present"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Creative Director</h3>
            <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
            <p>
              Creative Direction, User Experience, Visual Design, Project Management, Team Leading
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="2010 - 2011"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Art Director</h3>
            <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
            <p>
              Creative Direction, User Experience, Visual Design, SEO, Online Marketing
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="2008 - 2010"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Web Designer</h3>
            <h4 className="vertical-timeline-element-subtitle">Los Angeles, CA</h4>
            <p>
              User Experience, Visual Design
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            date="2006 - 2008"
            iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Web Designer</h3>
            <h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
            <p>
              User Experience, Visual Design
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="April 2013"
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Content Marketing for Web, Mobile and Social Media</h3>
            <h4 className="vertical-timeline-element-subtitle">Online Course</h4>
            <p>
              Strategy, Social Media
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="November 2012"
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Agile Development Scrum Master</h3>
            <h4 className="vertical-timeline-element-subtitle">Certification</h4>
            <p>
              Creative Direction, User Experience, Visual Design
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            className="vertical-timeline-element--education"
            date="2002 - 2006"
            iconStyle={{ background: 'rgb(233, 30, 99)', color: '#fff' }}
          >
            <h3 className="vertical-timeline-element-title">Bachelor of Science in Interactive Digital Media Visual Imaging</h3>
            <h4 className="vertical-timeline-element-subtitle">Bachelor Degree</h4>
            <p>
              Creative Direction, Visual Design
            </p>
          </VerticalTimelineElement>
          <VerticalTimelineElement
            iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
          />*/}
          </VerticalTimeline>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SearchResultModal.propTypes = {
  savePaper: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  save: state.save,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { savePaper }
)(withRouter(SearchResultModal));

//export default SearchResultModal;
