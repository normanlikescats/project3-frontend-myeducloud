import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { BACKEND_URL } from "../constant";
import { UserContext } from "../Context/UserContext";
import { Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Classes() {
  const user = useContext(UserContext);
  const [classes, setClasses] = useState([]);
  const [classStatus, setClassStatus] = useState(true);
  const [userId, setUserId] = useState();
  const [myClass, setMyClass] = useState();

  console.log(user.dbUser);

  const getAllClasses = async () => {
    await axios.get(`${BACKEND_URL}/class`).then((res) => {
      const { data } = res;
      setClasses(data);
    });
  };

  const checkUserClassSubject = async () => {
    console.log(user.dbUser.id);
    await axios
      .get(`${BACKEND_URL}/class/myclass`, { userId: userId })
      .then((res) => {
        const { data } = res;
        setMyClass(data);
        if (res.data.class_subjects.length > 0) {
          setClassStatus(false);
        }
      });
  };

  useEffect(() => {
    setUserId(user.dbUser.id);
    getAllClasses();
    checkUserClassSubject();
  }, []);

  const handleJoinButton = async (e) => {
    const classId = e.target.id;

    await axios
      .post(`${BACKEND_URL}/class`, {
        userId: userId,
        classSubjectId: classId,
      })
      .then((res) => {
        console.log(res);
      });
  };

  const displayClasses = classes.map((classSubject) => (
    <div key={classSubject.id} id={classSubject.id}>
      {classSubject.name}{" "}
      {classStatus ? (
        <Button id={classSubject.id} onClick={handleJoinButton}>
          Join
        </Button>
      ) : null}
    </div>
  ));

  return (
    <div>
      {myClass ? (
        <div>
          Class Joined: {myClass ? myClass.class_subjects[0].name : null}
        </div>
      ) : (
        <div>
          Available Classes:
          {displayClasses}
        </div>
      )}
      <div>
        {user ? (
          <div>
            <Link to={`/question/${userId}`}>My Questionnaire</Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
