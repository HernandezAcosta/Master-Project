import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/NavBar";
//import Landing from "./components/layout/Landing";
import Home from "./components/layout/Home";
import Conferences from "./components/layout/Conferences";
import Conferences2 from "./components/layout/Conferences2";
import Roles from "./components/layout/Roles";
import Reviews from "./components/layout/Reviews";
import AcceptingPapers from "./components/layout/AcceptingPapers";
import Submissions from "./components/layout/Submissions";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import PrivateRouteReviews from "./components/private-route/PrivateRouteReviews";
import PrivateRouteAcceptingPapers from "./components/private-route/PrivateRouteAcceptingPapers";
import Dashboard from "./components/dashboard/Dashboard";
import './App.css';

import ReadSum from "./ReadSum";
import SetSum from "./SetSum";

import ReadString from "./ReadString";
import SetString from "./SetString";
import SimpleReactFileUpload from "./SimpleReactFileUpload";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  console.log("App.js Decoded jwtToken: " + JSON.stringify(decoded));
  console.log("App.js decoded.userRole: " + decoded.currentRole);
  //this.setState({ userRole: decoded.currentRole });
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  state = { loading: true, drizzleState: null, userRole: "" };

  componentDidMount() {

    if(localStorage.jwtToken){
      const token = localStorage.jwtToken;
      const decoded = jwt_decode(token);

      console.log("App.js Decoded jwtToken componentDidMount: " + JSON.stringify(decoded));
      console.log("App.js decoded.userRole componentDidMount: " + decoded.currentRole);
      this.setState({ userRole: decoded.currentRole });
    }

    const { drizzle } = this.props;


    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {

      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();
      console.log("drizzleState.accounts: " + JSON.stringify(drizzleState.accounts));
      console.log("drizzleState.transactionStack: " + JSON.stringify(drizzleState.transactionStack));
      //console.log("drizzleState.accounts balance: " + JSON.stringify(drizzleState.accountBalances));
      //console.log("drizzleState.contracts: " + JSON.stringify(drizzleState.contracts));
      //console.log("drizzleState.transactions: " + JSON.stringify(drizzleState.transactions));
      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        this.setState({ loading: false, drizzleState });

      }
    });
  }

  compomentWillUnmount() {
      this.unsubscribe();
    }

  render() {
    console.log("this.state App.js: " + JSON.stringify(this.state));
    if (this.state.loading){
      return (
        <div>"Please connect to RPC with Metamask. Loading Peer Review Platform...."</div>
      )
    }
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar userRole={this.state.userRole} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/>
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />

            {/*<Route exact path="/roles" component={Roles} />
            <Route exact path="/conferences" component={Conferences} />
            <Route exact path="/reviews" component={Reviews} />
            render={(props) => <Conferences drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />}

            */}
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/conferences" component={Conferences} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/>
              <PrivateRoute exact path="/roles" component={Roles} />
              <PrivateRoute exact path="/submissions" component={Submissions} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/>
              <PrivateRouteReviews exact path="/reviews" component={Reviews} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/>
              <PrivateRouteReviews exact path="/acceptingpapers" component={AcceptingPapers} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/>
            </Switch>

            {/*<ReadSum
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
            <SetSum
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
            <ReadString
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
            <SetString
              drizzle={this.props.drizzle}
              drizzleState={this.state.drizzleState}
            />
            <SimpleReactFileUpload/>*/}

          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
