import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant";
import TestForm from "./TestForm";
import { UserContext } from "../Context/UserContext";

export default function Test() {
  const navigate = useNavigate();
  const [tests, setTests] = useState("");
  const [changeTracker, setChangeTracker] = useState("");
  const user = useContext(UserContext);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/test/all`).then((response) => {
      setTests(response.data);
    });
  }, [changeTracker]);

  function handleClick(testId) {
    navigate(`/questions/${testId}`);
  }

  function toggleRefresh(){
    setChangeTracker(()=>changeTracker+1)
  }

  function handleDelete(id, users_class_subject_id){
    axios.delete(`${BACKEND_URL}/test/${users_class_subject_id}/${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`
        },
      }).then(()=>{
        alert("Test deleted!")
        setChangeTracker(()=>changeTracker+1)
      })
  }

  let testItems;

  if (tests) {
    testItems = tests.map((test) => {
      return(
        <div>
          <button onClick={()=>handleDelete(test.id, test.users_class_subject_id)}>Delete</button>
          <div onClick={() => handleClick(test.id)}>
            Test: {test.name}
          </div>
        </div>
      )
    });
  }

  return (
    <div>
      All the Tests
      <TestForm toggleRefresh={toggleRefresh}/>
      {testItems}
    </div>
  );
}
