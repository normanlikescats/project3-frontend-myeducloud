import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

export default function NavBar() {
  return (
    <Navbar>
      <Container>
        <Nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/class/">My Class</Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
