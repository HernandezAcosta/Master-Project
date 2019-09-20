import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ReviewSubmissionModal from './ReviewSubmissionModal';
import InspectReviewModal from './InspectReviewModal';
import axios from 'axios';
import { connect } from "react-redux";
import PropTypes from "prop-types";


export class Reviews extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      modalShow: false,
      modalShowInspectReviews: false,
      selectedPaperHash: "",
      currentPaperTitel: "",
      currentPaperAuthorFirstName: "",
      currentPaperAuthorLastName: "",
      papers: [],
      reviews: [],
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

  render() {
    let modalClose = () => this.setState({ modalShow: false });
    let modalCloseInspectReviews = () => this.setState({ modalShowInspectReviews: false });
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
                  <th>Download Paper</th>
                  <th>Add a Review</th>
                  <th>Inspect Reviews</th>
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
                        <td><Button variant="primary" className="paperSubmitBtn" onClick={() => this.downloadPaper(paper.paperHash)}>Download Paper</Button></td>
                        <td><Button variant="secondary" className="paperSubmitBtn" onClick={() => this.setState({ modalShow: true, selectedPaperHash: paper.paperHash, currentPaperTitel: paper.title, currentPaperAuthorFirstName: paper.authorFirstName, currentPaperAuthorLastName: paper.authorLastName})}>Review</Button></td>
                        <td><Button variant="secondary" className="paperSubmitBtn" onClick={() => this.setState({ modalShowInspectReviews: true, selectedPaperHash: paper.paperHash, currentPaperId: paper._id, currentPaperIndex: index })}>Inspect</Button></td>
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



          { (this.state.selectedPaperHash) ? <InspectReviewModal
            show={this.state.modalShowInspectReviews}
            userPapers={this.state.papers}
            userPaperReviews={this.state.reviews}
            currentPaperIndex={this.state.currentPaperIndex}
            currentUserID={this.props.auth.user.id}
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            onHide={modalCloseInspectReviews}
          /> : null }

        </div>
      );
  }
}

Reviews.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps
)(Reviews);

//export default Reviews;
