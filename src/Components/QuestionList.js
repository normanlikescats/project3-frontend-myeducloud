import React from "react";
import QuestionForm from "./QuestionForm";
import { useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

// pass test id via props
export default function QuestionList(props){
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([])
  
  useEffect(()=>{
    // add in props.testid once it's built
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/questionnaire/1`).then((response)=>{
      setQuestions(response.data)
    })
  },[])

  function handleDelete(id){
    // add in props.testid once it's built
    axios.delete(`${process.env.REACT_APP_BACKEND_URL}/questionnaire/delete/${id}`).then(()=>{
      navigate("/questions")
    })
  }

  function handleClick(id){
    console.log(`id: ${id}`)
    console.log(id)
    navigate(`/questions/${id}`)
  }

  let questionItems;
  if (questions){
    questionItems = questions.map((question, counter)=>{
      return(
        <div onClick={()=>handleClick(question.id)}>
          <button onClick={()=> handleDelete(question.id)}>Delete</button>
          Question {counter + 1}: {question.question}
          <ol>
            {question.option_a ? <li key={1}>Option A: {question.option_a}</li> : null}
            {question.option_b ? <li key={2}>Option B: {question.option_b}</li> : null}
            {question.option_c ? <li key={3}>Option C: {question.option_c}</li> : null}
            {question.option_d ? <li key={4}>Option D: {question.option_d}</li> : null}
            {question.option_e ? <li key={5}>Option E: {question.option_e}</li> : null}
          </ol>
        </div>
      )
    })
  } 
  
  return(
    <div>
      All the Questions!
      <QuestionForm testId={1} />
      {questionItems}
    </div>
  )
}