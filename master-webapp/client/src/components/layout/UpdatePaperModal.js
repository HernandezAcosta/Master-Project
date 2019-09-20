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
import bs58 from "bs58";



export class UpdatePaperModal extends React.Component {

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
      papers: [],
      currentPaperId: null,
      stackId: null
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.fileUpload = this.fileUpload.bind(this)
  }



  componentDidMount(){
    console.log("UpdatePaperModal drizzle obj: " + this.props.drizzle);
    console.log("UpdatePaperModal drizzleState obj: " + this.props.drizzleState);
    console.log("UpdatePaperModal this.props.currentPaperId: " + this.props.currentPaperId);
    axios.get(`/api/papers/getAll/`)
      .then(res => {
        console.log("Axios get User by ID: " + res.data);
        const papers = res.data;
        this.setState({papers: papers});

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
        conferenceTitle: this.refs.conferenceTitle.value === "" ? "" : this.refs.conferenceTitle.value,
        firstName: this.refs.firstName.value === "" ? "" : this.refs.firstName.value,
        lastName: this.refs.lastName.value === "" ? "" : this.refs.lastName.value,
        email: this.refs.email.value === "" ? "" : this.refs.email.value,
        walletAddress: this.refs.walletAddress.value === "" ? "" : this.refs.walletAddress.value,
        country: this.refs.country.value === "" ? "" : this.refs.country.value,
        organization: this.refs.organization.value === "" ? "" : this.refs.organization.value,
        website: this.refs.website.value === "" ? "" : this.refs.website.value,
        title: this.refs.title.value === "" ? "" : this.refs.title.value,
        abstract: this.refs.abstract.value === "" ? "" : this.refs.abstract.value,
        keywords: this.refs.keywords.value === "" ? "" : this.refs.keywords.value,
        file: this.state.file === "" ? "" : paperHash,
        paperPath: this.state.file === "" ? "" : paperPath
      };


      console.log("UpdatePaperModal before update this.props.currentPaperHash: " + this.props.currentPaperHash);
      console.log("UpdatePaperModal before update: " + this.getPaperId(this.props.currentPaperHash));
      let paperId = this.getPaperId(this.props.currentPaperHash);
      console.log("UpdatePaperModal before update paperId: " + paperId);
      axios.post(`/api/papers/elementUpdate/` + paperId, newPaperSubmission).then(response => {
        console.log("UpdatePaperModal response: " + JSON.stringify(response));
        var res = response.data.info;//info: "Element Updated"
        console.log("UpdatePaperModal savePaper response: " + res);
        if(res === "Element Updated"){

            console.log("UpdatePaperModal Test");
            const { drizzle, drizzleState } = this.props;
            //const drizzle = this.props.route.drizzle;
            //const drizzleState = this.props.route.drizzleState;
            console.log("UpdatePaperModal Test2");
            const contract = drizzle.contracts.PaperReviewHistory;

            // let drizzle know we want to call the `set` method with `value`
            console.log("UpdatePaperModal oldHash: " + this.props.currentPaperHash.toString());
            console.log("UpdatePaperModal newHash: " + paperHash.toString());

            const bytes2 = bs58.decode(this.props.currentPaperHash);
            console.log("UpdatePaperModal Decoded in HEX: " + bytes2.toString('hex'));
            var oldHashForContract = bytes2.toString('hex').slice(4);

            const bytes2_2 = bs58.decode(paperHash);
            console.log("UpdatePaperModal Decoded in HEX: " + bytes2_2.toString('hex'));
            var newHashForContract = bytes2.toString('hex').slice(4);

            const stackId = contract.methods["updatePaper"].cacheSend("0x" + oldHashForContract.toString(), "0x" + newHashForContract.toString(), {
              from: drizzleState.accounts[0]
            });

            console.log("UpdatePaperModal stackId: " + stackId);

            // save the `stackId` for later reference
            this.setState({ stackId });
        } else {
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

  getPaper(paperHash){
      for(var i = 0; i < this.state.papers.length; i++){
        if(this.state.papers[i].paperHash === paperHash){
          return this.state.papers[i];
        }
      }
  }

  getPaperId(paperHash){
      for(var i = 0; i < this.state.papers.length; i++){
        if(this.state.papers[i].paperHash === paperHash){
          return this.state.papers[i]._id;
        }
      }
  }

  render() {
    console.log("UpdatePaperModal this.props.currentPaperHash: " + this.props.currentPaperHash);
    let paper = this.getPaper(this.props.currentPaperHash);
    console.log("UpdatePaperModal paper: " + JSON.stringify(paper));
    //console.log("this.props PaperSubmissionModal.js: " + JSON.stringify(this.props));
    if (typeof paper == "undefined"){

      return (
        <div>"Loading Paper...."</div>
      )
    }
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered

      >
        <Modal.Header closeButton >
          <Modal.Title id="contained-modal-title-vcenter">
            Update your paper - Author Information
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
                <Form.Control ref="conferenceTitle" defaultValue={paper.conferenceTitle} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formFirstName">
              <Form.Label column sm="2">
                First Name
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="firstName" defaultValue={paper.authorFirstName} placeholder="John" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formLastName">
              <Form.Label column sm="2">
                Last Name
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="lastName" defaultValue={paper.authorLastName} placeholder="Doe" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                Email
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="email" defaultValue={paper.authorEmail} placeholder="email@example.com" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formWalletAddress">
              <Form.Label column sm="2">
                Wallet Address
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="walletAddress" defaultValue={paper.authorWalletAddress} placeholder="...." />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formCountry">
              <Form.Label column sm="2">
                Country
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="country" defaultValue={paper.authorCountry} placeholder="Germany" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formOrganization">
              <Form.Label column sm="2">
                Organization
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="organization" defaultValue={paper.authorOrganization} placeholder="Uni Göttingen" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formWebsite">
              <Form.Label column sm="2">
                Website
              </Form.Label>
              <Col sm="10">
                <Form.Control ref="website" defaultValue={paper.authorWebsite} placeholder="www.google.de" />
              </Col>
            </Form.Group>



          <h4>Title and Abstract</h4>

          <Form.Group as={Row} controlId="formTitle">
            <Form.Label column sm="2">
              Title
            </Form.Label>
            <Col sm="10">
              <Form.Control ref="title" defaultValue={paper.title} placeholder="A study on..." />
            </Col>
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Abstract</Form.Label>
            <Form.Control ref="abstract" defaultValue={paper.abstract} as="textarea" rows="6" />
          </Form.Group>

          <Form.Group as={Row} controlId="formKeywords">
            <Form.Label column sm="2">
              Keywords
            </Form.Label>
            <Col sm="10">
              <Form.Control ref="keywords" defaultValue={paper.keywords} placeholder="Blockchain, Peer-review" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formUpload">
            <Form.Label column sm="2">
              File upload
            </Form.Label>
            <Col sm="10">
              <input type="file" accept="application/pdf" onChange={this.onChange} />
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

UpdatePaperModal.propTypes = {
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
)(withRouter(UpdatePaperModal));

//export default UpdatePaperModal;
