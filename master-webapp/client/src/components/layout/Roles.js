import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { updateUser } from "../../actions/authActions";
import { loginUser } from "../../actions/authActions";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "../../actions/types";

export class Roles extends React.Component {


  constructor(...args) {
    super(...args);

    this.state = {
      currentRole: ""
    };
  }

  componentDidMount(){
    console.log("Roles props: " + JSON.stringify(this.props));
    this.setState({currentRole: this.props.auth.user.currentRole});
    if(this.props.auth.user.currentRole === "reviewer") {
      this.setRoleReviewer(true);
    } else if (this.props.auth.user.currentRole === "author"){
      this.setRoleAuthor(true);
    } else if (this.props.auth.user.currentRole === "editor") {
      this.setRoleEditor(true);
    }

  }


  componentWillReceiveProps(nextProps) {
    console.log("Roles componentWillReceiveProps props: " + JSON.stringify(nextProps));
      /*if (nextProps.auth.isAuthenticated) {
        console.log("Roles ComponentWillReceiveProps auth JSON: " + JSON.stringify(nextProps.auth));
        if(nextProps.auth.currentRole === "reviewer"){
          this.props.history.push("/reviews"); // push user with role reviewer to reviews when they login
        } else {
          this.props.history.push("/conferences"); // push user to conferences when they login
        }
      }

    if (nextProps.errors) {
          this.setState({
            errors: nextProps.errors
          });
        }*/
    }



  setRoleReviewer(calledFromDidMount){
    console.log("Roles setRoleReviewer called");
    document.getElementById('reviewerButton').innerHTML='Current'; // primary background-color: #0069d9;border-color: #0062cc; secondary background-color: #5a6268; border-color: #545b62;
    document.getElementById('authorButton').innerHTML='Switch';
    document.getElementById('editorButton').innerHTML='Switch';

    document.getElementById('reviewerButton').style.backgroundColor = "#0069d9";
    document.getElementById('reviewerButton').style.borderColor = "#0062cc";

    document.getElementById('authorButton').style.backgroundColor = "#5a6268";
    document.getElementById('authorButton').style.borderColor = "#545b62";

    document.getElementById('editorButton').style.backgroundColor = "#5a6268";
    document.getElementById('editorButton').style.borderColor = "#545b62";

    const userData = {
          id: this.props.auth.user.id,
          currentRole: "reviewer"
        };

    if (!calledFromDidMount) {
      this.props.updateUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    }

  }

  setRoleAuthor(calledFromDidMount){
    console.log("Roles setRoleAuthor called");
    document.getElementById('reviewerButton').innerHTML='Switch';
    document.getElementById('authorButton').innerHTML='Current';
    document.getElementById('editorButton').innerHTML='Switch';

    document.getElementById('authorButton').style.backgroundColor = "#0069d9";
    document.getElementById('authorButton').style.borderColor = "#0062cc";

    document.getElementById('reviewerButton').style.backgroundColor = "#5a6268";
    document.getElementById('reviewerButton').style.borderColor = "#545b62";

    document.getElementById('editorButton').style.backgroundColor = "#5a6268";
    document.getElementById('editorButton').style.borderColor = "#545b62";

    const userData = {
          id: this.props.auth.user.id,
          currentRole: "author"
        };

    this.props.updateUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    if (!calledFromDidMount) {
      this.props.updateUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    }

  }

  setRoleEditor(calledFromDidMount){
    console.log("Roles setRoleEditor called");
    document.getElementById('reviewerButton').innerHTML='Switch';
    document.getElementById('authorButton').innerHTML='Switch';
    document.getElementById('editorButton').innerHTML='Current';

    document.getElementById('editorButton').style.backgroundColor = "#0069d9";
    document.getElementById('editorButton').style.borderColor = "#0062cc";

    document.getElementById('authorButton').style.backgroundColor = "#5a6268";
    document.getElementById('authorButton').style.borderColor = "#545b62";

    document.getElementById('reviewerButton').style.backgroundColor = "#5a6268";
    document.getElementById('reviewerButton').style.borderColor = "#545b62";

    const userData = {
          id: this.props.auth.user.id,
          currentRole: "editor"
        };

    this.props.updateUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    if (!calledFromDidMount) {
      this.props.updateUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    }

  }


  render() {
    let currentRole = this.props.auth.user.currentRole;
    console.log("Roles currentRole: " + currentRole);
      return (
        <div>
          <div >
            <p className="blockText infoText">You are currently logged in as a reviewer. Here you can switch to a different role that you are assigned to.</p>
          </div>
          <div id="rolesTable">
            <Table striped bordered hover>

              <thead>
                <tr>
                  <th>#</th>
                  <th>Your Role</th>
                  <th>Switch Role</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="tableElements">1</td>
                  <td className="tableElements">Reviewer</td>
                  <td><Button variant="primary" className="paperSubmitBtn" ref="reviewerButton" id="reviewerButton" onClick={() => this.setRoleReviewer(false)}>Current</Button></td>
                </tr>
                <tr>
                  <td className="tableElements">2</td>
                  <td className="tableElements">Author</td>
                  <td><Button variant="secondary" className="paperSubmitBtn" ref="authorButton" id="authorButton" onClick={() => this.setRoleAuthor(false)}>Switch</Button></td>
                </tr>
                <tr>
                  <td className="tableElements">3</td>
                  <td className="tableElements">Editor</td>
                  <td><Button variant="secondary" className="paperSubmitBtn" ref="editorButton" id="editorButton" onClick={() => this.setRoleEditor(false)}>Switch</Button></td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      );
  }
}

Roles.propTypes = {
  updateUser: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});


export default connect(
  mapStateToProps,
  { updateUser, loginUser }
)(Roles);


//export default Roles;
