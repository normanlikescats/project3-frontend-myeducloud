import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../constant";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

export const UserContext = createContext("test");

export function UserProvider({ children }) {
  const [dbUser, setDbUser] = useState(null);
  const { isAuthenticated, user, loginWithRedirect } = useAuth0();
  const [accessToken, setAccessToken] = useState();

  const loginButton = (
    <Button onClick={() => loginWithRedirect()}>Log In</Button>
  );

  const retrieveProfile = async () => {
    await axios
      .post(`${BACKEND_URL}/profile`, {
        userEmail: user.email,
      })
      .then((res) => {
        const { data } = res;
        setDbUser(data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkUser = async () => {
    if (!isAuthenticated) {
      navigate("/");
    } else {
      let token = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUDIENCE,
        scope: "openid profile email phone",
      });
      setAccessToken(token);
    }
  };

  useEffect(() => {
    checkUser();
    retrieveProfile();
  }, [isAuthenticated]);

  return (
    <UserContext.Provider value={{ dbUser, loginButton, accessToken }}>
      {children}
    </UserContext.Provider>
  );
}

export const UserAuth = () => {
  // to make sure that UserContext can be used in components
  return useContext(UserContext);
};
