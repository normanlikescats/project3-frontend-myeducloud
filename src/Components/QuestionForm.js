import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant";
import { UserContext } from "../Context/UserContext";
import "./QuestionForm.css";
import Button from 'react-bootstrap/Button';

export default function QuestionForm(props) {
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [optionE, setOptionE] = useState("");
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const testId = props.testId;

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post(
        `${BACKEND_URL}/questionnaire/${testId}`,
        {
          question: question,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          option_e: optionE,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      )
      .then((response) => {
        props.toggleRefresh();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="question-form">
      <form id="question-form" className="question-form-flex" onSubmit={handleSubmit}>
        <h2>New Question</h2>
        <div className="question-form-input"> 
          <label>Question:</label>
          <input
            type="text"
            placeholder="Enter question here"
            className="question-form-field"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div className="question-form-input">
          <label>Option A: </label>
          <input
            type="text"
            placeholder="Option A"
            className="question-form-field"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
          />
        </div>
        <div className="question-form-input">
          <label>Option B: </label>
          <input
            type="text"
            placeholder="Option B"
            className="question-form-field"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
          />
        </div>
        <div className="question-form-input">
          <label>Option C: </label>
          <input
            type="text"
            placeholder="Option C"
            className="question-form-field"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
          /> 
        </div>
        <div className="question-form-input">
          <label>Option D: </label>
          <input
            type="text"
            placeholder="Option D"
            className="question-form-field"
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
          />
        </div>
        <div className="question-form-input">
          <label>Option E: </label>
          <input
          type="text"
          placeholder="Option E"
          className="question-form-field"
          value={optionE}
          onChange={(e) => setOptionE(e.target.value)}
          />
        </div> 
      </form>
      <Button type="submit" form="question-form">Add Question</Button>
    </div>
  );
}
