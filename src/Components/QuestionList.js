import React from "react";
import QuestionForm from "./QuestionForm";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BACKEND_URL } from "../constant";
import { UserContext } from "../Context/UserContext";

export default function QuestionList() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split("/");
  const testId = pathname[2];
  const [questions, setQuestions] = useState([]);
  const [testName, setTestName] = useState('')
  const user = useContext(UserContext);
  console.log(user)
  
  //pull test questions
  useEffect(() => {
    axios.get(`${BACKEND_URL}/questionnaire/${testId}`).then((response) => {
      setQuestions(response.data);
    });
  }, []);


  //pull test name
  useEffect(() => {
    axios.get(`${BACKEND_URL}/test/testid/${testId}`).then((response) => {
      setTestName(response.data[0].name);
    });
  }, []);

  function handleDelete(id) {
    axios.delete(`${BACKEND_URL}/questionnaire/delete/${id}`,{
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        },
      }).then(() => {
      navigate(`/questions/${testId}`);
    });
  }

  function handleClick(id) {
    navigate(`/questions/${testId}/${id}`);
  }

  function handleBack(){
    if(user.dbUser.status){
      navigate(`/tests`);
    } else{
      navigate(`/class/`);
    }
  }


  let questionItems;
  if (questions) {
    questionItems = questions.map((question, counter) => {
      return (
        <div onClick={() => handleClick(question.id)}>
          { user.dbUser.status ? <button onClick={() => handleDelete(question.id)}>Delete</button> : null } 
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
      <button onClick={handleBack}>Back</button>
      Test: {testName}!
      {user.dbUser.status ? <QuestionForm testId={testId} /> : null}
      {questionItems}
    </div>
  );
}
