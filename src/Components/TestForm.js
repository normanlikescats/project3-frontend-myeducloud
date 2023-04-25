import React, { useContext } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant";
import Select from "react-select";
import { UserAuth, UserContext } from "../Context/UserContext";

export default function TestForm(props) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [accessToken, setAccessToken] = useState();
  const [options, setOptions] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    axios.get(`${BACKEND_URL}/test/class`).then((response) => {
      console.log(response.data);
      setOptions(response.data);
      setAccessToken(user.accessToken);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // fill in url
    axios
      .post(
        `${BACKEND_URL}/test/add`,
        {
          name: name,
          classIds: selectedOption,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        alert("Test Created!");
        props.toggleRefresh();
        navigate(`/tests`);
      });
  }

  function handleSelect(selected) {
    console.log(selected);
    let selectedArr = [];
    for (let i = 0; i < selected.length; i++) {
      selectedArr.push(selected[i].value);
    }
    setSelectedOption(selectedArr);
  }

  let optionsArr = [];
  if (options) {
    for (let i = 0; i < options.length; i++) {
      optionsArr.push({ value: options[i].id, label: options[i].name });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create Test</h1>
      <Select
        options={optionsArr}
        onChange={handleSelect}
        isMulti
        placeholder="Select Class Subject"
      />
      <label>Test Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Test Name"
      />
      <input type="submit" value="Create Test" />
    </form>
  );
}
