import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import QuestionEditForm from "./QuestionEditForm";
import ScoreForm from "./ScoreForm";
import { BACKEND_URL } from "../constant";
import { UserContext } from "../Context/UserContext";
import Button from 'react-bootstrap/Button';
import "./Question.css"

export default function Question(props) {
  const [options, setOptions] = useState([]);
  const [question, setQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answerChange, setAnswerChange] = useState(0);
  const [studentAnswersArray, setStudentAnswersArray] = useState([]);
  const [score, setScore] = useState('')
  const [editMode, setEditMode] = useState(false);
  const [testId, setTestId] = useState("");
  const optionsArray = ["A", "B", "C", "D", "E"];
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split("/");
  const questionId = pathname[3];
  const user = useContext(UserContext);

  // Pull question and options
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/questionnaire/question/${questionId}`)
      .then((response) => {
        setOptions([
          response.data[0].option_a,
          response.data[0].option_b,
          response.data[0].option_c,
          response.data[0].option_d,
          response.data[0].option_e,
        ]);
        setQuestion(response.data[0].question);
        console.log(`response test id: ${response.data[0].test_id}`);
        setTestId(response.data[0].test_id);
      });
  }, [editMode]);

  // Pull student's answer if they have...
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/answers/${questionId}/${user.dbUser.id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then((response) => {
        if (response.data.length !== 0) {
          console.log("we have answer!!!");
          setSelectedOption(response.data[0].answer);
          setAnswered(true);
        } else {
          console.log("NO answer!!!");
        }
      });
  }, [answerChange]);

    useEffect(() => {
    axios
      .get(
        `${BACKEND_URL}/score/question/${questionId}/user/${user.dbUser.id}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`
          },
        }
      )
      .then((response) => {
        console.log(response.data[0].score);
        if (response.data[0].score !== null) {
          setScore(response.data[0].score);
        }
      });
  }, [testId]);

  // Pull all students answers if user is a teacher
  useEffect(() => {
    if (user.dbUser.status === true) {
      axios
        .get(`${BACKEND_URL}/answers/${questionId}`, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        })
        .then((response) => {
          setStudentAnswersArray(response.data);
        });
    }
  }, [answerChange]);

  function handleSubmit(e) {
    e.preventDefault();
    // answer submit here
    console.log(selectedOption);
    if (answered) {
      axios
        .put(
          `${BACKEND_URL}/answers/${questionId}/${user.dbUser.id}`,
          {
            user_id: user.dbUser.id,
            answer: selectedOption,
          },
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        )
        .then(() => {
          setAnswerChange((answerChange) => {
            answerChange++;
          });
          alert("Answer Submitted!");
        });
    } else {
      axios
        .post(
          `${BACKEND_URL}/answers/${questionId}`,
          {
            questionnaire_id: questionId,
            user_id: user.dbUser.id,
            answer: selectedOption,
          },
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        )
        .then(() => {
          setAnswered(true);
          setAnswerChange((answerChange) => {
            answerChange++;
          });
          alert("Answer Submitted!");
        });
    }
  }

  function handleDelete() {
    axios
      .delete(`${BACKEND_URL}/questionnaire/delete/${questionId}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      .then(() => {
        console.log("delete: ", testId);
        alert("Question Deleted!");
        navigate(`/questions/${testId}`);
      });
  }

  function handleBack() {
    navigate(`/questions/${testId}`);
  }

  let optionsComponent;

  if (options) {
    optionsComponent = options.map((option, counter) => {
      if (optionsArray.indexOf(selectedOption) === counter) {
        return (
          <div className="option-flex">
            <input
              type="radio"
              name="options"
              value={optionsArray[counter]}
              style={{margin: "0 2vmin 0 0"}}
              onClick={(e) => setSelectedOption(optionsArray[counter])}
              checked
            />
            <label>{option}</label>
          </div>
        );
      } else {
        if (option) {
          return (
            <div className="option-flex">
              <input
                type="radio"
                name="options"
                value={optionsArray[counter]}
                style={{margin: "0 2vmin 0 0"}}
                onClick={(e) => setSelectedOption(optionsArray[counter])}
              />
              <label>{option}</label>
            </div>
          );
        } else {
          return null;
        }
      }
    });
  }

  let studentAnswersComponent;

  if (studentAnswersArray) {
    studentAnswersComponent = studentAnswersArray.map((answer) => {
      return (
        <div className="indiv-answer-div">
          <p>
            {answer.user.first_name} {answer.user.last_name}: {answer.answer}
          </p>
          {user.dbUser.status ? (
            <ScoreForm
              user_id={answer.user_id}
              question_id={questionId}
              student_answer_id={answer.id}
            />
          ) : null}
        </div>
      );
    });
  }

  return (
    <div>
      <Button style={{float: "left", margin:"0 5vmin 5vmin 0"}} onClick={handleBack}>Back</Button>
      <div className="question-indiv-page">
        <div className="question-header">
        <h2>Question</h2>
          <div className="button-div">
            {user.dbUser.status
            ? <div>
                <Button
                  onClick={() => {
                    setEditMode(!editMode);
                  }}
                >
                  {editMode ? "Cancel" : "Edit"}
                </Button>
                <Button style={{margin: "0 0 0 1vmin"}} onClick={handleDelete}>Delete</Button>
              </div>
            : null}
            </div>
          </div>
        {editMode ? (
          <QuestionEditForm
            options={options}
            question={question}
            questionId={questionId}
            testId={testId}
            setEditMode={setEditMode}
          />
        ) : (
          <div>
            <form id="answer-form" onSubmit={handleSubmit}>
              <h3 style={{margin:"0 0 2vmin 0"}}>{question}</h3>
              {optionsComponent}
            </form>
            <Button form="answer-form" type="submit" style={{margin:"2vmin 0 0 0"}}>{answered ? "Edit Answer" : "Submit Answer"}</Button>
            {user.dbUser.status === false ? <p style={{margin: "3vmin 0 0 0"}} >Score: {answered && score ? score : "No score yet"}</p> : null}
          </div>
        )}
        {user.dbUser.status ?
        (<div className="answers-div"> 
          <h2>Answers</h2>
          {studentAnswersComponent}
        </div>) : null}
      </div>
    </div>
  );
}
