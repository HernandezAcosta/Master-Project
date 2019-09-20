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
import { saveReview } from "../../actions/saveActions";
import { Link, withRouter } from "react-router-dom";
import bs58 from "bs58";



export class ReviewSubmissionModal extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      firstName: "",
      lastName: "",
      email: "",
      walletAddress: "",
      country: "",
      organization: "",
      website: "",
      title: "",
      authorOfPaper: "",
      pcMembers: "",
      overallEvaluation: "",
      reviewerConfidence: "",
      review: "",
      reviewRemarks: "",
      errors: {},
      file:null,
      currentUser: {}
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }

  componentDidMount(){
    axios.get(`/api/users/getbyid/` + this.props.currentUserID)
      .then(res => {
        console.log("Axios get User by ID: " + res.data);
        const user = res.data;
        this.setState({currentUser: user});

      })

  }

  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  onFormSubmit(e){
    console.log("Form submitted!");
    e.preventDefault() // Stop form submit
    console.log("isEmpty(this.refs.firstName.value): " + this.isEmpty(this.refs.firstName.value));
    const newReviewSubmission = {
      firstName: this.isEmpty(this.refs.firstName.value) ? " ": this.refs.firstName.value,
      lastName: this.isEmpty(this.refs.lastName.value) ? " ": this.refs.lastName.value,
      email: this.isEmpty(this.refs.email.value) ? " ": this.refs.email.value,
      walletAddress: this.isEmpty(this.refs.walletAddress.value) ? " ": this.refs.walletAddress.value,
      country: this.isEmpty(this.refs.country.value) ? " ": this.refs.country.value,
      organization: this.isEmpty(this.refs.organization.value) ? " ": this.refs.organization.value,
      website: this.isEmpty(this.refs.website.value) ? " ": this.refs.website.value,
      title: this.isEmpty(this.refs.title.value) ? " ": this.refs.title.value,
      authorOfPaper: this.isEmpty(this.refs.authorOfPaper.value) ? " ": this.refs.authorOfPaper.value,
      hashOfPaper: this.isEmpty(this.refs.hashOfPaper.value) ? " ": this.refs.hashOfPaper.value,
      pcMembers: this.isEmpty(this.refs.pcMembers.value) ? " ": this.refs.pcMembers.value,
      overallEvaluation: this.refs.overallEvaluation.value,
      reviewerConfidence: this.refs.reviewerConfidence.value,
      review: this.isEmpty(this.refs.review.value) ? " ": this.refs.review.value,
      reviewRemarks: this.isEmpty(this.refs.reviewRemarks.value) ? " ": this.refs.reviewRemarks.value,
    };

    console.log(this.refs.firstName.value)
    console.log(this.refs.lastName.value)
    console.log(this.refs.email.value)
    console.log(this.refs.walletAddress.value)
    console.log(this.refs.country.value)
    console.log(this.refs.organization.value)
    console.log(this.refs.website.value)
    console.log(this.refs.title.value)

    console.log("ReviewSubmissionModal overallEvaluation: " + this.refs.overallEvaluation.value);
    console.log("ReviewSubmissionModal reviewerConfidence: " + this.refs.reviewerConfidence.value);



    this.props.saveReview(newReviewSubmission, this.props.history).then((response)=>{
      console.log("ReviewSubmission saveReview response: " + JSON.stringify(response));
      var res = response.payload.info;
      if(res === "reviewHash already exists"){
        //Do nothing
      } else if(res === "Document saved!") {
        console.log("ReviewSubmissionModal test");
        const { drizzle, drizzleState } = this.props;
        //const drizzle = this.props.route.drizzle;
        //const drizzleState = this.props.route.drizzleState;
        const contract = drizzle.contracts.PaperReviewHistory;
        console.log("ReviewSubmissionModal test2");
        // let drizzle know we want to call the `set` method with `value`
        const bytes2 = bs58.decode(this.props.currentPaperHash);
        console.log("ReviewSubmissionModal Decoded in HEX: " + bytes2.toString('hex'));
        var hashForContract = bytes2.toString('hex').slice(4);

        var paperHashForDrizzle = "0x" + hashForContract;
        var walletAddressForDrizzle = newReviewSubmission.walletAddress;
        var nameForDrizzle = newReviewSubmission.firstName + " " + newReviewSubmission.lastName;
        var reviewHashForDrizzle = "0x" + response.payload.reviewHash;
        var overallEvaluationForDrizzle = newReviewSubmission.overallEvaluation;
        var reviewerConfidenceForDrizzle = newReviewSubmission.reviewerConfidence;
        console.log("ReviewSubmissionModal paperHashForDrizzle: " + paperHashForDrizzle);
        console.log("ReviewSubmissionModal walletAddressForDrizzle: " + walletAddressForDrizzle);
        console.log("ReviewSubmissionModal nameForDrizzle: " + nameForDrizzle);
        console.log("ReviewSubmissionModal reviewHashForDrizzle: " + reviewHashForDrizzle);
        console.log("ReviewSubmissionModal overallEvaluationForDrizzle: " + overallEvaluationForDrizzle);
        console.log("ReviewSubmissionModal reviewerConfidenceForDrizzle: " + reviewerConfidenceForDrizzle);
        console.log("ReviewSubmissionModal test2");

        const stackId = contract.methods["setReview"].cacheSend(paperHashForDrizzle.toString(), walletAddressForDrizzle.toString(), reviewHashForDrizzle.toString(), overallEvaluationForDrizzle, reviewerConfidenceForDrizzle, {
          from: drizzleState.accounts[0]
        });

        /*const stackId = contract.methods["setReview"].cacheSend("0xe740e78bdf5b8ede9ac6faa29a8f6a9f8267145972bb1a900d6792668a070f4d", "0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0", "0x4bc9c6a106c8f21742696c0a87d1b0b1e35c54fa1ee6e6e3a879c28def07ae39", 4, 4, {
          from: drizzleState.accounts[0]
        });*/

        console.log("ReviewSubmissionModal test3");
        console.log("ReviewSubmissionModal stackID: " + stackId);

        // save the `stackId` for later reference
        this.setState({ stackId });
      }
    });
  }
  onChange(e) {
    console.log("onChange called");
    this.setState({file:e.target.files[0]})
  }
  fileUpload(file){
    const url = 'http://localhost:5000/upload';
    const formData = new FormData();
    formData.append('file',file)
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return  post(url, formData,config)
  }
  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered

      >
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter">
            Submit your review - Reviewer Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Review Information</h4>

          <form onSubmit={this.onFormSubmit}>
            <Form.Group as={Row} controlId="formFirstName">
              <Form.Label column sm="2">
                First Name
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="firstName" defaultValue={this.state.currentUser.firstName} placeholder="John" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formLastName">
              <Form.Label column sm="2">
                Last Name
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="lastName" defaultValue={this.state.currentUser.lastName} placeholder="Doe" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Email
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="email" defaultValue={this.state.currentUser.email} placeholder="email@example.com" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formWalletAddress">
              <Form.Label column sm="2">
                Wallet Address
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="walletAddress" defaultValue={this.state.currentUser.walletAddress} placeholder="...." />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formCountry">
              <Form.Label column sm="2">
                Country
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="country" placeholder="Germany" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formOrganization">
              <Form.Label column sm="2">
                Organization
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="organization" placeholder="Uni Göttingen" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formWebsite">
              <Form.Label column sm="2">
                Website
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="website" placeholder="www.google.de" />
              </Col>
            </Form.Group>



          <h4>Reviewed Paper Title</h4>

          <Form.Group as={Row} controlId="formTitle">
            <Form.Label column sm="2">
              Reviewed Paper Title
            </Form.Label>
            <Col sm="10">
              <Form.Control ref="title" defaultValue={this.props.currentPaperTitel} placeholder="A study on..." />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPaperAuthor">
            <Form.Label column sm="2">
              Reviewed Paper Author
            </Form.Label>
            <Col sm="10">
              <Form.Control ref="authorOfPaper" defaultValue={this.props.currentPaperAuthorFirstName + " " + this.props.currentPaperAuthorLastName}  placeholder="..." />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPaperHash">
            <Form.Label column sm="2">
              Reviewed Paper Hash
            </Form.Label>
            <Col sm="10">
              <Form.Control ref="hashOfPaper" defaultValue={this.props.currentPaperHash} placeholder="..." />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPCMembers">
            <Form.Label column sm="2">
              PC Members
            </Form.Label>
            <Col sm="10">
              <Form.Control ref="pcMembers" placeholder="..." />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formOverallEvaluation">
            <Form.Label column sm="2">
              Overall Evaluation
            </Form.Label>
            <Col sm="10">
              {/*<Form.Control ref="overallEvaluation" placeholder="..." />*/}
              <ButtonToolbar>
                <ToggleButtonGroup type="radio" name="options" defaultValue={0} ref="overallEvaluation">
                  <ToggleButton variant="light" value={3} onClick={() => (this.refs.overallEvaluation.value = 3)}>3: strong accept</ToggleButton>
                  <ToggleButton variant="light" value={2} onClick={() => (this.refs.overallEvaluation.value = 2)}>2: accept</ToggleButton>
                  <ToggleButton variant="light" value={1} onClick={() => (this.refs.overallEvaluation.value = 1)}>1: weak accept</ToggleButton>
                  <ToggleButton variant="light" value={0} onClick={() => (this.refs.overallEvaluation.value = 0)}>0: borderline paper</ToggleButton>
                  <ToggleButton variant="light" value={-1} onClick={() => (this.refs.overallEvaluation.value = -1)}>-1: weak reject</ToggleButton>
                  <ToggleButton variant="light" value={-2} onClick={() => (this.refs.overallEvaluation.value = -2)}>-2: reject</ToggleButton>
                  <ToggleButton variant="light" value={-3} onClick={() => (this.refs.overallEvaluation.value = -3)}>-3: strong reject</ToggleButton>
                </ToggleButtonGroup>
              </ButtonToolbar>
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formReviewerConfidence">
            <Form.Label column sm="2">
              Reviewer Confidence
            </Form.Label>
            <Col sm="10">
              {/*<Form.Control ref="reviewerConfidence" placeholder="..." />*/}
              <ButtonToolbar>
                <ToggleButtonGroup type="radio" name="options" defaultValue={3} ref="reviewerConfidence">
                  <ToggleButton variant="light" value={5} onClick={() => (this.refs.reviewerConfidence.value = 5)}>5: expert</ToggleButton>
                  <ToggleButton variant="light" value={4} onClick={() => (this.refs.reviewerConfidence.value = 4)}>4: high</ToggleButton>
                  <ToggleButton variant="light" value={3} onClick={() => (this.refs.reviewerConfidence.value = 3)}>3: medium</ToggleButton>
                  <ToggleButton variant="light" value={2} onClick={() => (this.refs.reviewerConfidence.value = 2)}>2: low</ToggleButton>
                  <ToggleButton variant="light" value={1} onClick={() => (this.refs.reviewerConfidence.value = 1)}>1: none</ToggleButton>
                </ToggleButtonGroup>
              </ButtonToolbar>
            </Col>
          </Form.Group>

          {/*<Form.Group as={Row} controlId="formReview">
            <Form.Label column sm="2">
              Review
            </Form.Label>
            <Col sm="10">
              <Form.Control ref="review" as="textarea" rows="6" placeholder="..." />
            </Col>
          </Form.Group>*/}

          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Review</Form.Label>
            <Form.Control ref="review" as="textarea" rows="6" />
          </Form.Group>

          <Form.Group as={Row} controlId="formReviewRemarks">
            <Form.Label column sm="2">
              Review Remarks
            </Form.Label>
            <Col sm="10">
              <Form.Control ref="reviewRemarks" placeholder="..." />
              <Button type="submit">Submit the form!</Button>
            </Col>
          </Form.Group>


          </form>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ReviewSubmissionModal.propTypes = {
  saveReview: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  save: state.save,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { saveReview }
)(withRouter(ReviewSubmissionModal));

//export default PaperSubmissionModal;
