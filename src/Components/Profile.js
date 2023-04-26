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
  Table,
} from "react-bootstrap";
import "./Profile.css";

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
  const defaultProfilePic =
    "https://cdn-icons-png.flaticon.com/512/847/847970.png?w=826&t=st=1682395723~exp=1682396323~hmac=8a0ac7236e2391452d71f488f252dbb730ec4412bed1e23abba30ac7421dff84";

  useEffect(() => {
    checkUser();
    retrieveProfile();
  }, []);

  const checkUser = async () => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      let token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUDIENCE,
        scope: "openid profile email phone",
      });
      console.log("token", token);
      setAccessToken(token);
    }
  };

  const retrieveProfile = async () => {
    console.log("accessToken", accessToken);
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
        if (data[0].last_name === null) {
          alert("Please Edit Your Profile");
          setEditStatus(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleTests(){
    navigate("/tests")
  }

  const displayProfile = (
    <div className="profile">
      <div>ID: {profile.id}</div>
      <div>First Name: {profile.first_name}</div>
      <div>Last Name: {profile.last_name}</div>
      <div>Email: {profile.email}</div>
      <div>Status: {profile.status ? "Teacher" : "Student"}</div>
      <div style={{margin: "2vmin 0 0 0"}} >
        <Button onClick={(e) => setEditStatus(true)}>
          Edit Profile
        </Button>
        {profile.status ? <Button style={{margin: "0 0 0 2vmin"}} onClick={handleTests}>
          Tests
        </Button>: null}
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${BACKEND_URL}/profile`,
        {
          first_name: firstName,
          last_name: lastName,
          status: status,
          photo_url: photoUrl,
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
        <FormGroup>
          <FormLabel>Status:</FormLabel>
          <FormControl
            as="select"
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          >
            <option value={false}>Student</option>
            <option value={true}>Teacher</option>
          </FormControl>
        </FormGroup>
        <Button type="submit" value="submit">
          Submit
        </Button>{" "}
        <Button
          onClick={() => {
            setEditStatus(false);
          }}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );

  return (
    <div className="profile-body">
      <div className="profile-title">My Profile </div>

      {editStatus ? editProfile : displayProfile}
    </div>
  );
}
