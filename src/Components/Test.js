import React, { useContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
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

  function toggleRefresh() {
    setChangeTracker(() => changeTracker + 1);
  }

  let testItems;

  if (tests) {
    testItems = tests.map((test) => {
      return <div onClick={() => handleClick(test.id)}>Test: {test.name}</div>;
    });
  }

  return (
    <div>
      {user.dbUser.status ? (
        <div>
          All the Tests
          <TestForm toggleRefresh={toggleRefresh} />
          {testItems}
        </div>
      ) : (
        <div>
          All the Tests
          <div>{testItems}</div>
        </div>
      )}
    </div>
  );
}
