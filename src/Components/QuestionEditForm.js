import React from "react";
import axios from "axios";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export default function QuestionEditForm(props){
  const [question, setQuestion] = useState(props.question)
  const [optionA, setOptionA] = useState(props.options[0])
  const [optionB, setOptionB] = useState(props.options[1])
  const [optionC, setOptionC] = useState(props.options[2])
  const [optionD, setOptionD] = useState(props.options[3])
  const [optionE, setOptionE] = useState(props.options[4])
  const navigate = useNavigate();
  const testId = props.testId;
  

  function handleSubmit(e){
  e.preventDefault();
  
  axios.put(`${process.env.REACT_APP_BACKEND_URL}/questionnaire/edit/${props.questionId}`, {
    question: question,
    option_a: optionA,
    option_b: optionB,
    option_c: optionC,
    option_d: optionD,
    option_e: optionE,
  }).then((response)=>{
    console.log(response.data.id)
    props.setEditMode(false)
    navigate(`/questions/${response.data.id}`)
  }).catch(function (error) {
    console.log(error);
  });

  }

  return(
    <div>
      <form onSubmit={handleSubmit}>
        <label>Question:</label>
        <input type="text" placeholder={question} value={question} onChange={(e)=>setQuestion(e.target.value)}/>
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
        <input type="submit" value="Confirm changes!"/>
      </form>
    </div>
  )
}