import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant";
import { UserContext } from "../Context/UserContext";
import Button from 'react-bootstrap/Button';

export default function QuestionEditForm(props) {
  const [question, setQuestion] = useState(props.question);
  const [optionA, setOptionA] = useState(props.options[0]);
  const [optionB, setOptionB] = useState(props.options[1]);
  const [optionC, setOptionC] = useState(props.options[2]);
  const [optionD, setOptionD] = useState(props.options[3]);
  const [optionE, setOptionE] = useState(props.options[4]);
  const navigate = useNavigate();
  const testId = props.testId;
  const user = useContext(UserContext);

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .put(`${BACKEND_URL}/questionnaire/edit/${props.questionId}`, {
        question: question,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        option_e: optionE,
      },{
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        },
      })
      .then((response) => {
        console.log(response.data.id);
        props.setEditMode(false);
        navigate(`/questions/${testId}/${response.data.id}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="question-form">
      <form id="question-edit-form" className="question-form-flex" onSubmit={handleSubmit}>
        <h2>Edit Question</h2>
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
      <Button type="submit" form="question-edit-form">Confirm changes!</Button>
    </div>
  );
}
