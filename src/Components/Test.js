import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant";
import TestForm from "./TestForm";


export default function Test() {
  const navigate = useNavigate();
  const [tests, setTests] = useState("");

  useEffect(() => {
    axios.get(`${BACKEND_URL}/test/all`).then((response) => {
      setTests(response.data);
    });
  }, []);

  function handleClick(testId) {
    navigate(`/questions/${testId}`);
  }

  let testItems;

  if (tests) {
    testItems = tests.map((test) => {
      return <div onClick={() => handleClick(test.id)}>Test: {test.name}</div>;
    });
  }

  return (
    <div>
      All the Tests
      <TestForm/>
      {testItems}
    </div>
  );
}
