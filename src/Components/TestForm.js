import React from "react";
import axios from "axios";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Select from "react-select";

export default function TestForm(){
  const navigate = useNavigate();
  const [options, setOptions] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [name, setName] = useState('')

  useEffect(()=>{
    // fill in url
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/dadasad`).then((response)=>{
      setOptions(response.data)
    })
  },[])

  function handleSubmit(){
    // fill in url
    axios.post(`${process.env.REACT_APP_BACKEND_URL}/sdasdas`, {
      name: name
      }).then((response)=>{
        alert("Test Created!")
        navigate(`/questions/${response.data.id}`)
      })
  }

  function handleSelect(selected){
    console.log(selected)
    setSelectedOption(selected);
  }

  return(
    <form onSubmit={handleSubmit}>
      <h1>Create Test</h1>
      <Select
        options={options}
        onChange={handleSelect}
        placeholder="Select Class Subject"
      />
      <label>Test Name:</label>
      <input type="text" value={name} placeholder="Test Name"/>
      <input type="submit" value="Create Test"/>
    </form>
  )
}