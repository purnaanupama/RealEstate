import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';


const Navigation = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
    <Container fluid>
      <Navbar.Brand href="#">Redux Toolkit</Navbar.Brand>
        <Nav>
          <Nav.Link to={'/'} as={Link}>Products</Nav.Link>
        </Nav>
        <Navbar.Toggle/>
       <Navbar.Collapse>
        
         </Navbar.Collapse>
      </Container>
  </Navbar>
  )
}

export default Navigation