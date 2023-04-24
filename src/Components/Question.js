import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import { Navigate, useLocation } from 'react-router-dom'
import QuestionEditForm from "./QuestionEditForm";
import { UserContext } from "../Context/UserContext";
import ScoreForm from "./ScoreForm"
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Question(props){
  //const { user } = useContext(UserContext);
  const [options, setOptions] = useState([])
  const [question, setQuestion] = useState('')
  const[selectedOption, setSelectedOption] = useState(null)
  const [answered, setAnswered ] = useState(false)
  const [answerChange, setAnswerChange] = useState(0)
  const [studentAnswersArray, setStudentAnswersArray] = useState([])
  const [editMode, setEditMode] = useState(false)
  const optionsArray = ['A', 'B', 'C', 'D', 'E']
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split('/')
  const questionId = pathname[2]
  //console.log(user)
  
  // Pull question and options
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/questionnaire/question/${questionId}`).then((response)=>{
      setOptions([response.data[0].option_a, response.data[0].option_b, response.data[0].option_c, response.data[0].option_d, response.data[0].option_e])
      setQuestion(response.data[0].question)
    })
  },[editMode])

  // Pull student's answer if they have...
  // put in user id once i build it
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/answers/${questionId}/2`).then((response)=>{
      console.log(response.data)
      console.log(response.data.length !== 0)
      if(response.data.length !== 0){
        console.log("we have answer!!!")
        setSelectedOption(response.data[0].answer)
        setAnswered(true)
      } else{
        console.log("NO answer!!!")
      }
    })
  },[answerChange])

  // Pull all students answers if user is a teacher
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/answers/${questionId}`).then((response)=>{
      setStudentAnswersArray(response.data)
    })
  },[answerChange])


  function handleSubmit(e){
    e.preventDefault();
    // answer submit here
    console.log(selectedOption)
    if (answered){
      // put back user.id once built
      axios.put(`${process.env.REACT_APP_BACKEND_URL}/answers/${questionId}/2`,{
        //fill this with user id
        user_id: 2,
        answer: selectedOption
      }).then(()=>{
        setAnswerChange((answerChange)=>{answerChange++})
        alert("Answer Submitted!")
      })
    } else{
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/answers/${questionId}`,{
        questionnaire_id: questionId,
        //fill this with user id
        user_id: 2,
        answer: selectedOption
      }).then(()=>{
        setAnswered(true)
        setAnswerChange((answerChange)=>{answerChange++})
        alert("Answer Submitted!")
      })
    }
  }

  function handleDelete(){
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/questionnaire/delete/${questionId}`).then(()=>{
      alert("Question Deleted!")
      navigate("/questions")
    })
  };

  let optionsComponent;

  if(options){
    optionsComponent = options.map((option, counter)=>{
      if(optionsArray.indexOf(selectedOption)===counter){
        //should add some styling to show selected option
        return(
          <div>
            <input type="radio" name="options" value={optionsArray[counter]} onClick={(e)=> setSelectedOption(optionsArray[counter])} checked/>
            <label>{option}</label>
          </div>
        )
      } else{
        if(option){
        return(
          <div>
            <input type="radio" name="options" value={optionsArray[counter]} onClick={(e)=> setSelectedOption(optionsArray[counter])}/>
            <label>{option}</label>
          </div>
        )
        } else{
          return null
        }
      }
    })
  };

  let studentAnswersComponent;

  if(studentAnswersArray){
    studentAnswersComponent = studentAnswersArray.map((answer)=>{
      return(
        <div>
          <p>{answer.user.first_name} {answer.user.last_name}: {answer.answer}</p>
          <ScoreForm user_id = {answer.user_id} question_id = {questionId} student_answer_id={answer.id}/>
        </div>
      )
    })
  }

  return(
    <div>
      <button onClick={()=> setEditMode(true)}>{editMode ? "Cancel" : "Edit" }</button>
      <button onClick={handleDelete}>Delete</button>
      {editMode ?
      <QuestionEditForm 
      options={options}
      question={question}
      questionId = {questionId}
      setEditMode = {setEditMode}
      /> :      
        <form onSubmit={handleSubmit}>
          <h2>Question</h2>
          <h6>{props.question}</h6>
          {optionsComponent}
          <input type="submit" value="Submit Answer"/>
        </form>
      }
      {studentAnswersComponent}
    </div>
  )
}