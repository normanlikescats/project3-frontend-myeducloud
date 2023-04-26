import React, { useState, useEffect, useContext } from "react";
import QuestionForm from "./QuestionForm";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BACKEND_URL } from "../constant";
import { UserContext } from "../Context/UserContext";
import "./QuestionList.css"
import Button from 'react-bootstrap/Button';

export default function QuestionList() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split("/");
  const testId = pathname[2];
  const [questions, setQuestions] = useState([]);
  const [testName, setTestName] = useState('')
  const [changeTracker, setChangeTracker] = useState(0);
  const user = useContext(UserContext);
  console.log(user);

  //pull test questions
  useEffect(() => {
    axios.get(`${BACKEND_URL}/questionnaire/${testId}`).then((response) => {
      setQuestions(response.data);
    });
  }, [changeTracker]);

  //pull test name
  useEffect(() => {
    axios.get(`${BACKEND_URL}/test/testid/${testId}`).then((response) => {
      setTestName(response.data[0].name);
    });
  }, []);

  function handleDelete(id) {
    axios
      .delete(`${BACKEND_URL}/questionnaire/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }).then(() => {
      alert("Question deleted")
      toggleRefresh();
      navigate(`/questions/${testId}`);
    });
  }

  function handleClick(id) {
    navigate(`/questions/${testId}/${id}`);
  }

  function handleBack() {
    if (user.dbUser.status) {
      navigate(`/tests`);
    } else {
      navigate(`/class/`);
    }
  }

  function toggleRefresh(){
    setChangeTracker((changeTracker)=>changeTracker+1)
  }


  let questionItems;
  if (questions) {
    questionItems = questions.map((question, counter) => {
      return (
        <div className="individual-question" >
          <div onClick={() => handleClick(question.id)}>
            Question {counter + 1}: {question.question}
            <ol className="list">
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
          { user.dbUser.status ? <Button onClick={() => handleDelete(question.id)}>Delete</Button> : null } 
      </div>
      );
    });
  }

  return (
    <div>
      <Button style={{float: "left"}} onClick={handleBack}>Back</Button>
      <div className="question-list-flex">
        <h2 style={{margin: "3vmin 0 3vmin 0"}}>Test: {testName}!</h2>
        {user.dbUser.status ? <QuestionForm testId={testId} toggleRefresh={toggleRefresh}/> : null}
        {questionItems}
      </div>
    </div>
  );
}
