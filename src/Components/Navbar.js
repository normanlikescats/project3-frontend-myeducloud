import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import "./Navbar.css";
import { useContext } from "react";
import { UserContext } from "../Context/UserContext";

export default function NavBar() {
  const user = useContext(UserContext);

  return (
    <Navbar bg="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          MyEduCloud
        </Navbar.Brand>
        <Nav>
          <Link to="/profile">My Profile</Link>
          <Link to="/class/">My Class</Link>
          {/* {user.dbUser.status ? <Link to="/tests">My Tests</Link> : null} */}
        </Nav>
      </Container>
    </Navbar>
  );
}
