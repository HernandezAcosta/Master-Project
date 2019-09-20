import React, { Component } from "react";
//import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ReactTooltip from 'react-tooltip'
import Autocomplete from 'react-autocomplete';
import SearchResultModal from './SearchResultModal';
import AddConferenceModal from './AddConferenceModal';
import axios from 'axios';


class NavBar extends Component {

  constructor(){
    super();

    this.state = {
      modalShow: false,
      modalShowAddConference: false,
      hideReviewTab: false,
      hideAcceptingPapersTab: false,
      hideAddConferenceTab: false,
      value: '',
      selectedUserWalletAddress: "",
      users: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeAcceptingPapers = this.handleChangeAcceptingPapers.bind(this);
    this.handleChangeAddConference = this.handleChangeAddConference.bind(this);

    this.navBarInstance = (
      <div>
        <Nav.Link href="reviews" data-tip="Here you can find submitted papers and leave a review">Reviews</Nav.Link>
      </div>
    );

    this.navBarInstanceAcceptingPapers = (
      <div>
        <Nav.Link href="acceptingpapers" data-tip="Here you can accept submitted papers as an editor">Accepting Papers</Nav.Link>
      </div>
    );

    this.navBarInstanceAddConference = (
      <div>
        <Nav.Link href="#" onClick={() => this.setState({ modalShowAddConference: true })} data-tip="Here you can add a new conference">Add new Conference</Nav.Link>
      </div>
    );
  }

  handleChange(bool){
    if(bool) {
      this.setState({hideReviewTab: true});
    } else {
      this.setState({hideReviewTab: false});
    }

  }

  handleChangeAcceptingPapers(bool){
    if(bool) {
      this.setState({hideAcceptingPapersTab: true});
    } else {
      this.setState({hideAcceptingPapersTab: false});
    }

  }

  handleChangeAddConference(bool){
    if(bool) {
      this.setState({hideAddConferenceTab: true});
    } else {
      this.setState({hideAddConferenceTab: false});
    }

  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard


    axios.get(`/api/users/getAll`)
      .then(res => {
        console.log("Navbar Axios get Users: " + res.data);
        const users = res.data;
        this.setState({ users });

      })


    console.log("App.js userRole Prop for navbar: " + this.props.userRole);

    if (this.props.auth.user.currentRole === "reviewer") {
      console.log("A reviewer!");
      this.handleChange(false);
    } else if (this.props.auth.user.currentRole === "editor") {
      console.log("An editor!");
      this.handleChange(false);
      this.handleChangeAcceptingPapers(false);
      this.handleChangeAddConference(false);
    } else {
      console.log("Not a reviewer!");
      console.log("this.props.auth.user.currentRole: " + this.props.auth.user.currentRole);
      this.handleChange(true);
      this.handleChangeAcceptingPapers(true);
      this.handleChangeAddConference(true);
    }


    /*if (this.props.auth.user.currentRole !== "reviewer") {
        console.log("Not a reviewer!");
        console.log("this.props.auth.user.currentRole: " + this.props.auth.user.currentRole);
        this.handleChange(true);
    } else {
      console.log("A reviewer!");
      this.handleChange(false);
    }*/
  }

  render() {
    const style = (this.props.auth.user.currentRole !== "reviewer" && this.props.auth.user.currentRole !== "editor") ? {display: 'none'} : {};
    console.log("Not a reviewer!!!");
    console.log("Not this.state.hideReviewTab: " + this.state.hideReviewTab);

    const styleAcceptingPapers = (this.props.auth.user.currentRole !== "editor") ? {display: 'none'} : {};
    const stlyeAddConference = (this.props.auth.user.currentRole !== "editor") ? {display: 'none'} : {};

    console.log("NavBar.js this.props currentRole: " + JSON.stringify(this.props.auth.user.currentRole));
    if(typeof style === "undefined" && typeof styleAcceptingPapers === "undefined"){
      return <div>Loading Navbar</div>
    }
    let modalClose = () => this.setState({ modalShow: false });
    let modalCloseAddConference = () => this.setState({ modalShowAddConference: false });

    return (
      <div>
        <Navbar collapseOnSelect expand="xl" bg="dark" variant="dark">
            <Navbar.Brand href="/">Peer-Review-Platform</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="conferences" data-tip="Here you can find all conferences and have the opportunity to submit your own paper">Conferences</Nav.Link>
                <Nav.Link href="submissions" data-tip="Here your can find your submissions and inspect the current review state">Your Submissions</Nav.Link>
                  <div style={style}>
                    {this.navBarInstance}
                  </div>
                  <div style={styleAcceptingPapers}>
                    {this.navBarInstanceAcceptingPapers}
                  </div>
                  <div style={stlyeAddConference}>
                    {this.navBarInstanceAddConference}
                  </div>
                <Nav.Link href="roles" data-tip="Here you can switch to a different role">Roles</Nav.Link>
              </Nav>

              <Nav id="autoCompleteSearchItems" data-tip="Search for authors, walletaddresses, emails">
                <Autocomplete
                  /*items={[
                    { id: 'foo', label: 'foo' },
                    { id: 'bar', label: 'bar' },
                    { id: 'baz', label: 'baz' },
                  ]}*/

                  items={this.state.users}
                  shouldItemRender={(item, value) => item.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1 || item.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1 || item.email.toLowerCase().indexOf(value.toLowerCase()) > -1 || item.walletAddress.toLowerCase().indexOf(value.toLowerCase()) > -1} //&& value !== ""
                  getItemValue={item => (item.walletAddress)}
                  renderItem={(item, highlighted) =>
                    <div
                      key={item._id}
                      id="inputValueTxt"
                      style={{ backgroundColor: highlighted ? 'lightgrey' : '#fff'}}
                    >
                      {item.firstName} {item.lastName} {item.email} {item.walletAddress}
                    </div>
                  }
                  value={this.state.value}
                  onChange={e => this.setState({ value: e.target.value })}
                  onSelect={value => this.setState({ value })}
                />
              </Nav>

              <Form id="searchForm" inline>
                <Button variant="outline-info" id="formSearchBtn" onClick={() => this.setState({ modalShow: true })}>Search</Button>
              </Form>


              <Nav>
                <Nav.Link href="register">Register</Nav.Link>
                <Nav.Link eventKey={2} href="login">
                  Login/Logout
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>

          </Navbar>


          <ReactTooltip />

          { (this.state.value ? <SearchResultModal
            show={this.state.modalShow}
            selectedUserWalletAddress={this.state.value}
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            onHide={modalClose}
          /> : null) }



          <AddConferenceModal
            show={this.state.modalShowAddConference}
            currentUserID={this.props.auth.user.id}
            drizzle={this.props.drizzle}
            drizzleState={this.props.drizzleState}
            onHide={modalCloseAddConference}
          /> 


        </div>


    );
  }
}

NavBar.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});


export default connect(
  mapStateToProps,
)(NavBar);

//export default NavBar;
