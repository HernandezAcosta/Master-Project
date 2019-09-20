import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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



export class PaperSubmissionModal2 extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      conferenceTitle: "",
      firstName: "",
      lastName: "",
      email: "",
      walletAddress: "",
      country: "",
      organization: "",
      website: "",
      title: "",
      abstract: "",
      keywords: "",
      errors: {},
      file:null,
      currentUser: {},
      stackId: null
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }



  componentDidMount(){
  

  }

  onFormSubmit(e){
    console.log("Form submitted!");
    e.preventDefault() // Stop form submit


    console.log(this.refs.conferenceTitle.value)
    console.log(this.refs.firstName.value)
    console.log(this.refs.lastName.value)
    console.log(this.refs.email.value)
    console.log(this.refs.walletAddress.value)
    console.log(this.refs.country.value)
    console.log(this.refs.organization.value)
    console.log(this.refs.website.value)
    console.log(this.refs.title.value)
    console.log(this.refs.abstract.value)
    console.log(this.refs.keywords.value)
    console.log(this.state.file)
    this.fileUpload(this.state.file).then((response)=>{
      console.log("FileUpload Response:" + JSON.stringify(response.data));
      var paperHash = response.data.split(";")[0].split(":")[1];
      console.log("paperHash: " + paperHash);
      var paperPath = response.data.split(";")[1].split(":")[1];
      console.log("paperPath: " + paperPath);

      const newPaperSubmission = {
        conferenceTitle: this.refs.conferenceTitle.value === "" ? " " : this.refs.conferenceTitle.value,
        firstName: this.refs.firstName.value === "" ? " " : this.refs.firstName.value,
        lastName: this.refs.lastName.value === "" ? " " : this.refs.lastName.value,
        email: this.refs.email.value === "" ? " " : this.refs.email.value,
        walletAddress: this.refs.walletAddress.value === "" ? " " : this.refs.walletAddress.value,
        country: this.refs.country.value === "" ? " " : this.refs.country.value,
        organization: this.refs.organization.value === "" ? " " : this.refs.organization.value,
        website: this.refs.website.value === "" ? " " : this.refs.website.value,
        title: this.refs.title.value === "" ? " " : this.refs.title.value,
        abstract: this.refs.abstract.value === "" ? " " : this.refs.abstract.value,
        keywords: this.refs.keywords.value === "" ? " " : this.refs.keywords.value,
        file: this.state.file === "" ? " " : paperHash,
        paperPath: this.state.file === "" ? " " : paperPath
      };


      this.props.savePaper(newPaperSubmission, this.props.history).then((response)=>{
        console.log("PaperSubmission savePaper response: " + JSON.stringify(response));
        var res = response.payload.paperHash;
        console.log("PaperSubmission savePaper response: " + res);
        if(res === "paperHash already exists"){
          //Do nothing
        } else {
          console.log("PaperSubmission Test");
          const { drizzle, drizzleState } = this.props;
          //const drizzle = this.props.route.drizzle;
          //const drizzleState = this.props.route.drizzleState;
          console.log("PaperSubmission Test2");
          const contract = drizzle.contracts.PaperReviewHistory;

          // let drizzle know we want to call the `set` method with `value`
          const stackId = contract.methods["setPaper"].cacheSend(newPaperSubmission.walletAddress, newPaperSubmission.firstName + " " + newPaperSubmission.lastName, "0x" + newPaperSubmission.file, {
            from: drizzleState.accounts[0]
          });

          // save the `stackId` for later reference
          this.setState({ stackId });
        }
      });


    })

    //this.props.savePaper(newPaperSubmission, this.props.history);
  }

  getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // otherwise, return the transaction status
    return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
  };

  onChange(e) {
    console.log("onChange called file Object: " + e.target.files[0]);//JSON.stringify(e.target.files[0]));
    console.log("File Name: " + e.target.files[0].name);
    this.setState({file:e.target.files[0]});

  }
  fileUpload(file){
    const url = 'http://localhost:5000/upload';
    const formData = new FormData();
    formData.append('file',file)
    formData.append('fileInfo', "Just some information")
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  post(url, formData, config)
  }
  render() {
    //console.log("this.props PaperSubmissionModal.js: " + JSON.stringify(this.props));
    const { PaperReviewHistory } = this.props.drizzleState.contracts;

    // using the saved `dataKey`, get the variable we're interested in
    const testString = PaperReviewHistory.testString[this.state.dataKey];

    console.log("PapersubmissionModal2 testString: " + testString);
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered

      >
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter">
            Your Paper Review History
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

        <VerticalTimeline>
          <VerticalTimelineElement
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
          />
          </VerticalTimeline>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
    </Modal>
    );
  }
}

PaperSubmissionModal2.propTypes = {
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
)(withRouter(PaperSubmissionModal2));

//export default PaperSubmissionModal;
