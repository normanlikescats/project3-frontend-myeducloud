import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Navbar.css";

export default function NavBar() {
  return (
    <Navbar bg="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          MyEduCloud
        </Navbar.Brand>
        <Nav>
          <Link to="/profile">PROFILE</Link>
          <Link to="/class/">CLASS</Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
