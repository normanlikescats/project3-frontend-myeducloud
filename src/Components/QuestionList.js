import React from "react";
import QuestionForm from "./QuestionForm";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BACKEND_URL } from "../constant";

export default function QuestionList() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split("/");
  const testId = pathname[2];
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/questionnaire/${testId}`).then((response) => {
      setQuestions(response.data);
    });
  }, []);

  function handleDelete(id) {
    axios.delete(`${BACKEND_URL}/questionnaire/delete/${id}`).then(() => {
      navigate(`/questions/${testId}`);
    });
  }

  function handleClick(id) {
    navigate(`/questions/${testId}/${id}`);
  }

  let questionItems;
  if (questions) {
    questionItems = questions.map((question, counter) => {
      return (
        <div onClick={() => handleClick(question.id)}>
          <button onClick={() => handleDelete(question.id)}>Delete</button>
          Question {counter + 1}: {question.question}
          <ol>
            {question.option_a ? (
              <li key={1}>Option A: {question.option_a}</li>
            ) : null}
            {question.option_b ? (
              <li key={2}>Option B: {question.option_b}</li>
            ) : null}
            {question.option_c ? (
              <li key={3}>Option C: {question.option_c}</li>
            ) : null}
            {question.option_d ? (
              <li key={4}>Option D: {question.option_d}</li>
            ) : null}
            {question.option_e ? (
              <li key={5}>Option E: {question.option_e}</li>
            ) : null}
          </ol>
        </div>
      );
    });
  }

  return (
    <div>
      Test {testId}!
      <QuestionForm testId={1} />
      {questionItems}
    </div>
  );
}
