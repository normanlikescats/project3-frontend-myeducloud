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
import Test from "./Test";
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
  console.log(accessToken);

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

  console.log(profile);
  // const displayProfile = (
  //   <div>
  //     <div>
  //       <img src={`${photoUrl}`} />
  //     </div>
  //     <div>ID: {profile.id}</div>
  //     <div>First Name: {profile.first_name}</div>
  //     <div>Last Name: {profile.last_name}</div>
  //     <div>Email: {profile.email}</div>
  //   </div>
  // );

  const displayProfile = (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px",
        }}
      >
        <img
          src={`${profile.photoUrl ? profile.photoUrl : defaultProfilePic}`}
          alt={profile.first_name || "Profile Picture"}
          className="profile-pic"
        />
      </div>
      <Table variant="dark" bg="dark" striped bordered hover>
        <tbody>
          <tr>
            <td>ID:</td>
            <td>{profile.id}</td>
          </tr>
          <tr>
            <td>First Name:</td>
            <td>{profile.first_name}</td>
          </tr>
          <tr>
            <td>Last Name:</td>
            <td>{profile.last_name}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{profile.email}</td>
          </tr>
        </tbody>
      </Table>
    </>
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
        <Button onClick={(e) => setEditStatus(!editStatus)}>
          Edit Profile
        </Button>
      </div>
      {editStatus ? editProfile : displayProfile}
    </div>
  );
}
