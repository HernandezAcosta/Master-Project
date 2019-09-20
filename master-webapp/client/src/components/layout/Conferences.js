import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import PaperSubmissionModal from './PaperSubmissionModal';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from 'axios';

export class Conferences extends React.Component {

  componentDidMount(){
    //console.log("Conferences Props: " + JSON.stringify(this.props));
    //console.log("Conferences Drizzle: " + JSON.stringify(this.props.drizzle));
    //console.log("Conferences DrizzleState: " + JSON.stringify(this.props.drizzleState));

    axios.get(`/api/conferences/getAll`)
      .then(res => {
        console.log("HelloAxios get Conferences: " + res.data);
        const conferences = res.data;
        this.setState({ conferences });

      })

  }

  constructor(...args) {
    super(...args);

    this.state = {
      modalShow: false,
      currentConferenceTitle: '',
      conferences: []
    };
  }

  handleClick = () => {
    console.log('this is:', this);

  }
  render() {
      //console.log("this.props Conferences.js: " + JSON.stringify(this.props));
      let modalClose = () => this.setState({ modalShow: false });

      return (


        <div>
          <div >
            <p className="blockText infoText">You are currently logged in as an author. Choose a conference to submit your paper</p>
          </div>
          <div id="rolesTable">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Conference Title</th>
                  <th>Director</th>
                  <th>Year</th>
                  <th>Submit your paper</th>
                </tr>
              </thead>
              <tbody>
                {/*<tr>
                  <td>1</td>
                  <td>ACM SIGMIS</td>
                  <td>Victor Fleming</td>
                  <td>2019</td>
                  <td><Button variant="secondary" onClick={() => this.setState({ modalShow: true })}>Submit</Button></td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>CPR Conference</td>
                  <td>Carol Reed</td>
                  <td>2019</td>
                  <td><Button variant="secondary" onClick={() => this.setState({ modalShow: true })}>Submit</Button></td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Poster Session</td>
                  <td>Orson Welles</td>
                  <td>2019</td>
                  <td><Button variant="secondary" onClick={() => this.setState({ modalShow: true })}>Submit</Button></td>
                </tr>*/}
                {this.state.conferences.map((conference, index) => {
                  return <tr>
                    <td className="tableElements">{index}</td>
                    <td className="tableElements">{conference.title}</td>
                    <td className="tableElements">{conference.director}</td>
                    <td className="tableElements">{conference.year}</td>
                    <td><Button variant="secondary" className="paperSubmitBtn" onClick={() => this.setState({ modalShow: true, currentConferenceTitle: conference.title })}>Submit</Button></td>
                  </tr>
                })}

              </tbody>
            </Table>
          </div>

          <PaperSubmissionModal
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

Conferences.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});


export default connect(
  mapStateToProps
)(Conferences);

//export default Conferences;
