import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from 'axios';
import TimelineModal from './TimelineModal';
import PaperSubmissionModal from './PaperSubmissionModal';
import PaperSubmissionModal2 from './PaperSubmissionModal2';
import Moment from 'react-moment';

export class Conferences2 extends React.Component {

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

      })

  }

  constructor(...args) {
    super(...args);

    this.state = {
      modalShow: false,
      userPapers: []
    };
  }


  render() {
      //console.log("this.props Conferences.js: " + JSON.stringify(this.props));
      let modalClose = () => this.setState({ modalShow: false });

      return (

        <div>
          <div>
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
                  <th>Inspect your submission</th>
                </tr>
              </thead>
              <tbody>
                {this.state.userPapers.map((paper, index) => {
                  return <tr>
                    <td>{index}</td>
                    <td>{paper.conferenceTitle}</td>
                    <td>{paper.authorFirstName}</td>
                    <td><Moment>{paper.date}</Moment></td>{/*<Moment>{paper.date}</Moment>*/}
                    <td><Button variant="secondary" className="paperSubmitBtn" onClick={() => this.setState({ modalShow: true, currentPaperHash: paper.paperHash })}>Inspect</Button></td>
                  </tr>
                })}

              </tbody>
            </Table>
          </div>

          <PaperSubmissionModal2
            show={this.state.modalShow}
            currentConferenceTitle={this.state.currentConferenceTitle}
            currentUserID={this.props.auth.user.id}
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            onHide={modalClose}
          />

        </div>

      );
  }
}

Conferences2.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});


export default connect(
  mapStateToProps
)(Conferences2);

//export default Conferences2;
