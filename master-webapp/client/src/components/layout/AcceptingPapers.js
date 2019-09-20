import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ReviewSubmissionModal from './ReviewSubmissionModal';
import axios from 'axios';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import bs58 from "bs58";


export class AcceptingPapers extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      modalShow: false,
      selectedPaperHash: "",
      currentPaperTitel: "",
      currentPaperAuthorFirstName: "",
      currentPaperAuthorLastName: "",
      papers: [],
      reviews: []
    };
  }

  componentDidMount(){
    axios.get(`/api/papers/getAll`)
      .then(res => {
        console.log("HelloAxios get Papers: " + res.data);
        const papers = res.data;
        this.setState({ papers });

      })

      axios.get(`/api/reviews/getAll`)
        .then(res => {
          console.log("HelloAxios get Reviews: " + res.data);
          const reviews = res.data;
          this.setState({ reviews });

        })

  }

  downloadPaper(paperHash){
    console.log("paperHash: " + paperHash);
    window.open("http://localhost:5000/api/downloads/download/" + paperHash);
    /*axios.post(`/api/downloads/download`, {paperPath: paperPath})
      .then(res => {
        console.log("download paper response: " + JSON.stringify(res.data));
        const paper = res.data;
        window.open("http://localhost:5000/api/downloads/download");

      })*/
  /*fetch('http://localhost:8080/api/files')
    .then(response => {
      const filename =  response.headers.get('Content-Disposition').split('filename=')[1];
      response.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    });
 });*/
}

  acceptPaper(id, publishState, paperHash){
    console.log("Acceptingpapers paper id: " + id);
    console.log("Acceptingpapers paper publishState: " + publishState);
    var bool;
    if (publishState) {
      bool = false;
    } else {
      bool = true;
    }


    axios.post(`/api/papers/elementUpdate/` + id, {"publishState": bool})
      .then(res => {
        console.log("Acceptingpapers post paper state: " + res.data.publishState);
        window.location.reload();

      })

      const { drizzle, drizzleState } = this.props;
      //const drizzle = this.props.route.drizzle;
      //const drizzleState = this.props.route.drizzleState;
      const contract = drizzle.contracts.PaperReviewHistory;

      const bytes2 = bs58.decode(paperHash);
      var hashForContract = bytes2.toString('hex').slice(4);
      console.log("AcceptingPaper hashForContract Decoded in HEX: " + bytes2.toString('hex'));
      // let drizzle know we want to call the `set` method with `value`
      const stackId = contract.methods["releaseEtherToReviewers"].cacheSend(hashForContract.toString(), {
        from: drizzleState.accounts[0]
      });
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

  render() {
    let modalClose = () => this.setState({ modalShow: false });
    //console.log("this.props Reviews.js: " + JSON.stringify(this.props));

      return (
        <div>
          <div >
            <p className="blockText infoText">You are currently logged in as a reviewer. Here you can see all the submissions that are in need of your review.</p>
          </div>
          <div id="rolesTable">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Conference Title</th>
                  <th>Author</th>
                  <th>Title</th>
                  <th>Current Decisions</th>
                  <th>Publish State</th>
                  <th>Accept Paper</th>
                  <th>Download Paper</th>
                  <th>Add a Review</th>
                </tr>
              </thead>
              <tbody>
                {this.state.papers.map((paper, index) => {
                  {
                    if(paper.authorWalletAddress !== this.props.auth.user.walletAddress){
                      return <tr>
                        <td className="tableElements">{index}</td>
                        <td className="tableElements">{paper.conferenceTitle}</td>
                        <td className="tableElements">{paper.authorFirstName} {paper.authorLastName}</td>
                        <td className="tableElements">{paper.title}</td>
                        <td className="tableElements">{this.state.reviews.map((review, index) => {
                          if (review.hashOfPaper === paper.paperHash) {
                            return review.overallEvaluation + " "
                          }
                        })}
                        </td>
                        <td className="tableElements">{paper.publishState ? "Published" : "Not Published"}</td>
                        <td><Button variant="success" className="paperSubmitBtn" onClick={() => this.acceptPaper(paper._id, paper.publishState, paper.paperHash)}>Accept Paper</Button></td>
                        <td><Button variant="primary" className="paperSubmitBtn" onClick={() => this.downloadPaper(paper.paperHash)}>Download Paper</Button></td>
                        <td><Button variant="secondary" className="paperSubmitBtn" onClick={() => this.setState({ modalShow: true, selectedPaperHash: paper.paperHash, currentPaperTitel: paper.title, currentPaperAuthorFirstName: paper.authorFirstName, currentPaperAuthorLastName: paper.authorLastName})}>Review</Button></td>
                      </tr>
                    }
                  }

                })}
              </tbody>
            </Table>
          </div>

          <ReviewSubmissionModal
            show={this.state.modalShow}
            currentPaperHash={this.state.selectedPaperHash}
            currentPaperTitel={this.state.currentPaperTitel}
            currentPaperAuthorFirstName={this.state.currentPaperAuthorFirstName}
            currentPaperAuthorLastName={this.state.currentPaperAuthorLastName}
            currentUserID={this.props.auth.user.id}
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            onHide={modalClose}
          />

        </div>
      );
  }
}

AcceptingPapers.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps
)(AcceptingPapers);

//export default AcceptingPapers;
