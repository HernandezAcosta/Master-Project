import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import axios, { post } from 'axios';
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




export class InspectReviewModal extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      dataKey: null,
      dataKeys: []
    }


  }



  componentDidMount() {

    console.log("InspectReviewModal did Mount props: " + this.props);
    var { drizzle } = this.props;
    var contract = drizzle.contracts.PaperReviewHistory;

    // let drizzle know we want to watch the `myString` method
    console.log("InspectReviewModal currentPaperHash: " + this.props.currentPaperHash);
    console.log("InspectReviewModal testProp: " + this.props.testProp);
    console.log("InspectReviewModal testProp currentUserID: " + this.props.currentUserID);
    console.log("InspectReviewModal this.props.userPapers.length: " + this.props.userPapers.length);
    console.log("InspectReviewModal this.props.userPaperReviews.length: " + this.props.userPaperReviews.length);

    for(var i = 0; i < this.props.userPapers.length; i++){
      const bytes2 = bs58.decode(this.props.userPapers[i].paperHash);
      console.log("InspectReviewModal Decoded in HEX: " + bytes2.toString('hex'));
      var convertedHashForContract = bytes2.toString('hex').slice(4);

      this.state.dataKeys.push(contract.methods.getPaperReviewHistory.cacheCall("0x" + convertedHashForContract));

    }

    //var dataKey = contract.methods.getPaperReviewHistory.cacheCall("0x" + this.props.currentPaperHash);// + this.props.currentPaperHash);


    // save the `dataKey` to local component state for later reference
    //this.setState({ dataKey });


  }

  rateTheReviewer(rating, reviewerAddress) {
    console.log("rateTheReviewer = "+ rating + " " + reviewerAddress);

    axios.get(`/api/users/getByWalletAddress/` + reviewerAddress)
      .then(res => {
        console.log("rateTheReviewer get User by ID: " + res.data);
        const user = res.data;
        var numberOfRatings = user.numberOfRatings + 1;
        var trustedReviewerPercentage = user.trustedReviewerPercentage + rating;

        console.log("rateTheReviewer numberOfRatings = " + numberOfRatings);
        console.log("rateTheReviewer trustedReviewerPercentage = " + trustedReviewerPercentage);

        const newUserAtributes = {
          numberOfRatings: numberOfRatings,
          trustedReviewerPercentage: trustedReviewerPercentage

        };

        axios.post(`/api/users/elementUpdate/` + user._id, newUserAtributes)
          .then(res => {
            console.log("rateTheReviewer post user state: " + res.data.publishState);
            window.location.reload();

          })



      })

  }

  componenDidUpdate() {
    console.log("InspectReviewModal did Update props: " + this.props);
  }




  render() {
    console.log("InspectReviewModal render currentPaperIndex: " + this.props.currentPaperIndex);

    // get the contract state from drizzleState
    var { PaperReviewHistory } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    //var testString = PaperReviewHistory.getPaperReviewHistory[this.state.dataKey];
    var testString = PaperReviewHistory.getPaperReviewHistory[this.state.dataKeys[this.props.currentPaperIndex]];

    //var reviewerAddresses = JSON.stringify(testString).values[6];

    //console.log("InspectReviewModal getPaperReviewHistory raw testString: " + testString[0].args);
    console.log("InspectReviewModal getPaperReviewHistory: " + JSON.stringify(testString));
    let contractPaperReviewHashes = [];
    let dataObj = [];
    for (var property in testString) {
        if (testString.hasOwnProperty(property)) {
            // do stuff
            if(property === "value"){
              console.log("InspectReviewModal Object property:",property);
              console.log("InspectReviewModal Object value:",testString[property]);
              contractPaperReviewHashes = testString[property][6];
              dataObj = testString[property];
              console.log("InspectReviewModal Object value 6th:",testString[property][6]);
            }

        }
    }

    console.log("InspectReviewModal Object getPaperReviewHistory contractPaperReviewHashes: " + JSON.stringify(contractPaperReviewHashes));
    console.log("InspectReviewModal Object getPaperReviewHistory dataObj: " + JSON.stringify(dataObj));
    console.log("InspectReviewModal Object getPaperReviewHistory dataObj[9]: " + dataObj[9]);
    let counter = 0;
    {
      if(typeof dataObj === "undefined" ){
        return <div>Loading...</div>
      }
    }


    return (
      <Modal
        {...this.props}
        size="lg"
        dialogClassName="InspectReviewModal"
        aria-labelledby="contained-modal-title-vcenter"
        centered

      >
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter">
            Inspecting Reviews
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>



        <VerticalTimeline>

          {this.props.userPapers.map((paper, index) => {
            {
              const bytes2 = bs58.decode(paper.paperHash);
              console.log("InspectReviewModal Decoded in HEX: " + bytes2.toString('hex'));
              var convertedHashForContract = bytes2.toString('hex');
              convertedHashForContract ="0x" + convertedHashForContract.slice(4);
              console.log("InspectReviewModal Decoded convertedHashForContract: " + convertedHashForContract);
              console.log("InspectReviewModal Decoded dataObj[2]: " + dataObj[2]);

              if((convertedHashForContract) === dataObj[2]){
                return <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    date={new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format((dataObj[5][0] * 1000))}  //dataObj[8][index]
                    iconStyle={{ background: 'rgb(33, 243, 173)', color: '#fff' }}
                  >
                    <h3 className="vertical-timeline-element-title">{paper.title ? paper.title : "Paper has no title!"}</h3>
                    <h4 className="vertical-timeline-element-title">Paper submitted by {paper.authorFirstName} {paper.authorLastName}</h4>
                    <p>Author Wallet Address:</p>
                    <p className="vertical-timeline-element-subtitle">{paper.authorWalletAddress}</p>
                    <p>Abstract:</p>
                    <p>{paper.abstract ? paper.abstract : "Sample Abstract" }</p>
                    <p>Hash of Paper:</p>
                    <p><a href={'https://ipfs.io/ipfs/' + paper.paperHash}>{paper.paperHash}</a></p>
                  </VerticalTimelineElement>

              }
            }
          })}


          {this.props.userPaperReviews.map((review, index) => {
            {
            const bytes2_2 = bs58.decode(review.hashOfPaper);
            console.log("InspectReviewModal Decoded reviews in HEX: " + bytes2_2.toString('hex'));
            var convertedHashForContract = bytes2_2.toString('hex');
            convertedHashForContract ="0x" + convertedHashForContract.slice(4);
            console.log("InspectReviewModal Decoded reviews convertedHashForContract: " + convertedHashForContract);
            console.log("InspectReviewModal Decoded reviews dataObj[2]: " + dataObj[2]);
            if(convertedHashForContract === dataObj[2]){
              console.log("InspectReviewModal its true true: " + review.hashOfPaper + " " + dataObj[2]);
              console.log("InspectReviewModal timestamp: " + Date.now());
              console.log("InspectReviewModal counter: " + counter);
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
                  <p>Was the review helpful?:</p>
                  <p>
                  <ButtonToolbar>
                    <ToggleButtonGroup type="radio" name="options" defaultValue={0} ref="overallEvaluation">
                      <ToggleButton variant="light" value={100} onClick={() => (this.rateTheReviewer(100, review.reviewerWalletAddress))}>Yes</ToggleButton>
                      <ToggleButton variant="light" value={0} onClick={() => (this.rateTheReviewer(0, review.reviewerWalletAddress))}>No</ToggleButton>

                    </ToggleButtonGroup>
                  </ButtonToolbar>
                  </p>
                  <p id="hideCounter">{counter = counter + 1}</p>
                </VerticalTimelineElement>

            }

            }

          })}


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

InspectReviewModal.propTypes = {
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
)(withRouter(InspectReviewModal));

//export default InspectReviewModal;
