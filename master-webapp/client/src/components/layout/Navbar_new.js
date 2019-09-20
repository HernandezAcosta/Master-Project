import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
//import NavDropdown from 'react-bootstrap/NavDropdown';

class NavBar extends React.Component {
  state = { dataKey: null };

  componentDidMount() {

  }

  render() {
    //return <p>What is popping?</p>;
    return(
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="/">Peer-Review-Platform</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="conferences">Conferences</Nav.Link>
            <Nav.Link href="roles">Roles</Nav.Link>
            <Nav.Link href="reviews">Reviews</Nav.Link>
            {/**<NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>**/}
          </Nav>
          <Nav>
            <Nav.Link href="signup">Sign Up</Nav.Link>
            <Nav.Link eventKey={2} href="login">
              Log In
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )

  }
}

export default NavBar;
