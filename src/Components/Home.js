import React, { useState, useEffect } from "react";
import { Button, Container, NavLink, Navbar, Nav } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

export default function Home() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const loginButton = (
    <Button onClick={() => loginWithRedirect()}>Log In</Button>
  );

  const logoutButton = (
    <Button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out
    </Button>
  );

  console.log(isAuthenticated);
  return (
    <div>
      <Navbar>
        <Container>
          <Nav className="navbar">
            <Link to="/">Home</Link>
            <Link to="/profile">My Profile</Link>
            <Link to="/class">My Class</Link>
          </Nav>
        </Container>
      </Navbar>{" "}
      <div>Welcome to MyEduCloud</div>
      <div>{isAuthenticated ? logoutButton : loginButton}</div>
    </div>
  );
}
