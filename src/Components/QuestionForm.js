import React from "react";
import axios from "axios";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function QuestionForm(props){
  const [question, setQuestion] = useState("")
  const [optionA, setOptionA] = useState("")
  const [optionB, setOptionB] = useState("")
  const [optionC, setOptionC] = useState("")
  const [optionD, setOptionD] = useState("")
  const [optionE, setOptionE] = useState("")
  const navigate = useNavigate();
  const testId = props.testId;
  
  function handleSubmit(e){
  e.preventDefault();
  
  axios.post(`${process.env.REACT_APP_BACKEND_URL}/questionnaire/${testId}`, {
    question: question,
    option_a: optionA,
    option_b: optionB,
    option_c: optionC,
    option_d: optionD,
    option_e: optionE,
  }).then((response)=>{
    console.log("response")
    console.log(response.data.id)
    navigate(`/questions/${testId}/${response.data.id}`)
  }).catch(function (error) {
    console.log(error);
  });

  }

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <h2>New Question</h2>
        <label>Question:</label>
        <input type="text" placeholder="Enter question here" value={question} onChange={(e)=>setQuestion(e.target.value)}/>
        <label>Option A: </label>
        <input type="text" placeholder="Option A" value={optionA} onChange={(e)=>setOptionA(e.target.value)}/>
        <label>Option B: </label>
        <input type="text" placeholder="Option B" value={optionB} onChange={(e)=>setOptionB(e.target.value)}/>
        <label>Option C: </label>
        <input type="text" placeholder="Option C" value={optionC} onChange={(e)=>setOptionC(e.target.value)}/>
        <label>Option D: </label>
        <input type="text" placeholder="Option D" value={optionD} onChange={(e)=>setOptionD(e.target.value)}/>
        <label>Option E: </label>
        <input type="text" placeholder="Option E" value={optionE} onChange={(e)=>setOptionE(e.target.value)}/>
        <input type="submit" value="Add Question!"/>
      </form>
    </div>
  )
}