import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant";

export default function QuestionForm(props) {
  const navigate = useNavigate();
  const [score, setScore] = useState(null);
  const [testId, setTestId] = useState("");
  const [scored, setScored] = useState(false);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/questionnaire/question/${props.question_id}`)
      .then((response) => {
        setTestId(response.data[0].test_id);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `${BACKEND_URL}/score/question/${props.question_id}/user/${props.user_id}`
      )
      .then((response) => {
        console.log(response.data[0].score);
        if (response.data[0].score !== null) {
          setScore(response.data[0].score);
          setScored(true);
        }
      });
  }, [testId]);

  function handleSubmit() {
    if (scored === true) {
      axios
        .put(`${BACKEND_URL}/score/edit/${props.student_answer_id}`, {
          score: score,
        })
        .then(() => {
          alert("Score updated");
          navigate(`/questions/${testId}/${props.question_id}`);
        });
    } else {
      axios
        .post(`${BACKEND_URL}/score/add/${props.student_answer_id}`, {
          test_id: Number(testId),
          user_id: Number(props.user_id),
          student_answer_id: props.student_answer_id,
          score: score,
        })
        .then(() => {
          alert("Score submitted");
          navigate(`/questions/${testId}/${props.question_id}`);
        });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Score: </p>
      <input
        type="text"
        value={score}
        onChange={(e) => {
          setScore(e.target.value);
        }}
      />
      <input type="submit" value="Confirm" />
    </form>
  );
}
