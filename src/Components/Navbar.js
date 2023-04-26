import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "../Navbar.css";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";

export default function NavBar() {
  const user = useContext(UserContext);

  return (
    <Navbar>
      <Container>
        <Nav className="navbar">
          <Link to="/">Home</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/class/">My Class</Link>
          <Link to="/tests">Tests</Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
