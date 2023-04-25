import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { BACKEND_URL } from "../constant";
import { UserContext } from "../Context/UserContext";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Classes() {
  const user = useContext(UserContext);
  const [classes, setClasses] = useState([]);
  const [classStatus, setClassStatus] = useState(true);
  const [userId, setUserId] = useState();
  const [myClass, setMyClass] = useState();

  useEffect(() => {
    setUserId(user.dbUser.id);
    checkUserClassSubject();
    getAllClasses();
  }, [userId]);

  const getAllClasses = async () => {
    await axios.get(`${BACKEND_URL}/class`).then((res) => {
      const { data } = res;
      setClasses(data);
    });
  };

  const checkUserClassSubject = async () => {
    await axios.get(`${BACKEND_URL}/class/${userId}`).then((res) => {
      const { data } = res;
      console.log(data);
      setMyClass(data);
      if (res.data.class_subjects.length > 0) {
        setClassStatus(false);
      } else {
        alert("Please join a class");
      }
    });
  };
  console.log();
  const handleJoinButton = async (e) => {
    const classId = e.target.id;

    await axios
      .post(`${BACKEND_URL}/class`, {
        userId: userId,
        classSubjectId: classId,
      })
      .then((res) => {
        console.log(res);
        setClassStatus(false);
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
      {classStatus ? (
        <div>
          Available Classes:
          {displayClasses}
        </div>
      ) : (
        <div>Class Joined: {myClass.class_subjects[0].name}</div>
      )}
      <div>
        {classStatus ? null : (
          <div>
            <Button as={Link} to={`/questions`}>
              My Questionnaire
            </Button>
            <Button
              variant="success"
              as={Link}
              to={`/chatroom/${myClass.class_subjects[0].id}`}
            >
              My Chatroom
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
