import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from 'axios';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import TimelineModal from './TimelineModal';
import UpdatePaperModal from './UpdatePaperModal';
import Moment from 'react-moment';


export class Submissions extends React.Component {

  componentDidMount(){
    //console.log("Conferences Props: " + JSON.stringify(this.props));
    //console.log("Conferences Drizzle: " + JSON.stringify(this.props.drizzle));
    console.log("Timeline.js called! Drizzle: " + this.props.drizzle);
    console.log("Timeline.js called! Drizzle.drizzleState: " + this.props.drizzleState);

    axios.get(`/api/papers/getAllByWalletAddress/` + this.props.auth.user.walletAddress)
      .then(res => {
        console.log("Axios Timeline.js get papers: " + res.data);
        const userPapers = res.data;
        console.log("Timeline.js papers: " + JSON.stringify(userPapers));
        this.setState({ userPapers });
        console.log("TimeLine.js currentUser walletAddress: " + this.props.auth.user.walletAddress);
        console.log("TimeLine.js currentUser email: " + this.props.auth.user.email);

        const allPaperReviews = [];
        console.log("TimeLine.js userPapers.length: " + userPapers.length);

        axios.get(`/api/reviews/getAll/`)
          .then(res => {
            console.log("Axios Timeline.js get reviews: " + res.data);
            const reviews = res.data;
            console.log("Timeline.js paperReviews: " + JSON.stringify(reviews));
            console.log("Timeline.js allPaperReviews: " + JSON.stringify(allPaperReviews));
            this.setState({userPaperReviews: reviews});


          })




      })



  }

  constructor(...args) {
    super(...args);

    this.state = {
      modalShow: false,
      updatePaperModalShow: false,
      selectedPaperHash: null,
      currentPaperId: null,
      userPapers: [],
      userPaperReviews: [],
      currentPaperIndex: null
    };
  }

  render() {
    let modalClose = () => this.setState({ modalShow: false });
    let updatePaperModalClose = () => this.setState({ updatePaperModalShow: false });

      return (
        <div>

          <div >
            <p className="blockText infoText">Here You can see all your submissions and inspect the current state of the review process</p>
          </div>
          <div id="rolesTable">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Conference Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Publish State</th>
                  <th>Update your submission</th>
                  <th>Inspect your submission</th>
                </tr>
              </thead>
              <tbody>
                {this.state.userPapers.map((paper, index) => {
                  return <tr>
                    <td className="tableElements">{index}</td>
                    <td className="tableElements">{paper.conferenceTitle}</td>
                    <td className="tableElements">{paper.authorFirstName}</td>
                    <td className="tableElements"><Moment>{paper.date}</Moment></td>{/*<Moment>{paper.date}</Moment>*/}
                    <td className="tableElements">{paper.publishState ? "Published" : "Not Published"}</td>
                    <td><Button variant="secondary" className="paperSubmitBtn" onClick={() => this.setState({ updatePaperModalShow: true, selectedPaperHash: paper.paperHash, currentPaperIndex: index })}>Update</Button></td>
                    {console.log("Timeline paper.paperHash: " + paper.paperHash)}
                    {console.log("Timeline paper.paperHash2: " + paper.paperHash)}
                    {console.log("Timeline this.state.selectedPaperhash: " + this.state.selectedPaperhash)}
                    {console.log("Timeline paper._id: " + paper._id)}
                    <td><Button variant="secondary" className="paperSubmitBtn" onClick={() => this.setState({ modalShow: true, selectedPaperHash: paper.paperHash, currentPaperId: paper._id, currentPaperIndex: index })}>Inspect</Button></td>
                    {console.log("Timeline this.state.selectedPaperhash2: " + this.state.selectedPaperHash)}
                    {console.log("Timeline paper._id 2: " + paper._id)}
                  </tr>
                })}

              </tbody>
            </Table>
          </div>


          { (this.state.selectedPaperHash) ? <UpdatePaperModal
            show={this.state.updatePaperModalShow}
            userPapers={this.state.userPapers}
            currentPaperHash={this.state.selectedPaperHash}
            currentPaperId={this.state.currentPaperId}
            userPaperReviews={this.state.userPaperReviews}
            currentPaperIndex={this.state.currentPaperIndex}
            currentUserID={this.props.auth.user.id}
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            onHide={updatePaperModalClose}
          /> : null }

          { (this.state.selectedPaperHash) ? <TimelineModal
            show={this.state.modalShow}
            userPapers={this.state.userPapers}
            userPaperReviews={this.state.userPaperReviews}
            currentPaperIndex={this.state.currentPaperIndex}
            currentUserID={this.props.auth.user.id}
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            onHide={modalClose}
          /> : null }



        </div>
      );
  }
}

Submissions.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});


export default connect(
  mapStateToProps
)(Submissions);

//export default Submissions;
