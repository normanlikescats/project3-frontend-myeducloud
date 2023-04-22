import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { BACKEND_URL } from "../constant";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
} from "react-bootstrap";
import Classes from "./Classes";
import { Link } from "react-router-dom";

export default function Profile() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [status, setStatus] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [profile, setProfile] = useState({});
  const [editStatus, setEditStatus] = useState(false);

  useEffect(() => {
    retrieveProfile();

    if (profile.first_name === null) {
      alert("Please Edit Your Profile");
      setEditStatus(true);
    }
  }, []);

  const retrieveProfile = async () => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      let token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUDIENCE,
        scope: "openid profile email phone",
      });
      setAccessToken(token);

      await axios
        .post(
          `${BACKEND_URL}/profile`,
          {
            userEmail: user.email,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then((res) => {
          const { data } = res;
          setProfile(data[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const displayProfile = (
    <div>
      <div>
        <img src={`${photoUrl}`} />
      </div>
      <div>ID: {profile.id}</div>
      <div>First Name: {profile.first_name}</div>
      <div>Last Name: {profile.last_name}</div>
      <div>Email: {profile.email}</div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .put(`${BACKEND_URL}/profile`, {
        first_name: firstName,
        last_name: lastName,
        status: status,
        photo_url: photoUrl,
        userEmail: user.email,
      })
      .then((res) => {
        const { data } = res;
        setProfile(data[0]);
      });
    setEditStatus(false);
  };

  const editProfile = (
    <div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel>First Name:</FormLabel>
          <FormControl
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel>Last Name:</FormLabel>
          <FormControl
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FormGroup>
        <Button type="submit" value="submit">
          Submit
        </Button>
      </Form>
    </div>
  );

  return (
    <div>
      <div>My Profile</div>
      <div>
        <Button onClick={(e) => setEditStatus(true)}>Edit Profile</Button>
      </div>
      {editStatus ? editProfile : displayProfile}
    </div>
  );
}
