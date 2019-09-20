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
import { saveConference } from "../../actions/saveActions";
import { Link, withRouter } from "react-router-dom";
import bs58 from "bs58";



export class AddConferenceModal extends React.Component {

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
    console.log("PaperSubmission drizzle obj: " + this.props.drizzle);
    console.log("PaperSubmission drizzleState obj: " + this.props.drizzleState);
    axios.get(`/api/users/getbyid/` + this.props.currentUserID)
      .then(res => {
        console.log("Axios get User by ID: " + res.data);
        const user = res.data;
        this.setState({currentUser: user});

      })

  }

  onFormSubmit(e){
    console.log("Form submitted!");
    e.preventDefault() // Stop form submit


    console.log(this.refs.conferenceTitle.value)
    console.log(this.refs.firstName.value)
    console.log(this.refs.lastName.value)
    console.log(this.refs.email.value)
    console.log(this.refs.walletAddress.value)
    console.log(this.refs.year.value)

    var firstNameDirector = this.refs.firstName.value === "" ? " " : this.refs.firstName.value;
    var lastNameDirector = this.refs.lastName.value === "" ? " " : this.refs.lastName.value;

    const newConference = {
      title: this.refs.conferenceTitle.value === "" ? " " : this.refs.conferenceTitle.value,
      director: firstNameDirector + " " + lastNameDirector,
      year: this.refs.year.value === "" ? " " : this.refs.year.value
    };

    console.log("newConference : " + JSON.stringify(newConference));

    this.props.saveConference(newConference, this.props.history).then((response)=>{
      console.log("newConference saveConference response: " + JSON.stringify(response));

      
    });





    //this.props.saveConference(newPaperSubmission, this.props.history);
  }

  getTxStatus = () => {

    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

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
    //console.log("this.props AddConferenceModal.js: " + JSON.stringify(this.props));
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered

      >
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter">
            Submit your paper - Author Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Author Information</h4>

          <form onSubmit={this.onFormSubmit}>
            <Form.Group as={Row} controlId="conferenceTitle">
              <Form.Label column sm="2">
                Conference Title
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="conferenceTitle" defaultValue="Test Conference" placeholder="Test Conference"/>
              </Col>
            </Form.Group>

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

            <Form.Group as={Row} controlId="formYear">
              <Form.Label column sm="2">
                Year
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="year" placeholder="2019" defaultValue="2019" />
              </Col>
            </Form.Group>

          <Form.Group as={Row} controlId="formUpload">
            <Form.Label column sm="2">
              Add Conference
            </Form.Label>
            <Col sm="10">

              <Button type="submit">Add Conference!</Button>
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

AddConferenceModal.propTypes = {
  saveConference: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  save: state.save,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { saveConference }
)(withRouter(AddConferenceModal));

//export default AddConferenceModal;
