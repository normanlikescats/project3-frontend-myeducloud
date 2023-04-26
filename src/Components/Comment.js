import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { BACKEND_URL } from "../constant";
import { UserContext } from "../Context/UserContext";
import { Button, Form, FormControl, FormGroup } from "react-bootstrap";

export default function Comment(props) {
  const user = useContext(UserContext);

  const [comments, setComments] = useState();
  const [userComment, setUserComment] = useState();
  const [userId, setUserId] = useState();
  const [questionnaireId, setQuestionnaireId] = useState();

  useEffect(() => {
    setUserId(12);
    setQuestionnaireId(2);
    retrieveComments();
  }, [3]);

  const retrieveComments = async () => {
    await axios
      .get(`${BACKEND_URL}/comment`, {
        userId,
        questionnaireId,
      })
      .then((res) => {
        console.log(res);
        const { data } = res;
        setComments(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async () => {
    await axios
      .post(`${BACKEND_URL}/comment`, {
        userId,
        questionnaireId,
        userComment,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(userComment);
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl
            as="textarea"
            row={2}
            value={userComment}
            onChange={(e) => {
              setUserComment(e.target.value);
            }}
          ></FormControl>
        </FormGroup>
        <Button value="submit">Submit</Button>
      </Form>
    </div>
  );
}
