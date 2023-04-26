import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../constant";
import Select from "react-select";
import { UserContext } from "../Context/UserContext";
import Button from 'react-bootstrap/Button';

export default function TestForm(props) {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [options, setOptions] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [name, setName] = useState("");
  const [accessToken, setAccessToken] = useState();

  const selectFieldStyles = {
    option: (provided) => ({
      ...provided,
      color: "black",
    }),
  };

  useEffect(() => {
    axios.get(`${BACKEND_URL}/test/class`).then((response) => {
      setOptions(response.data);
      setAccessToken(user.accessToken);
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
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

  return(
    <div>
      <form id="test-form" className="test-form" onSubmit={handleSubmit}>
        <h1 className="dark-blue-text">Create A Test</h1>
        <Select
          className="test-form-input"
          styles = {selectFieldStyles}
          options={optionsArr}
          onChange={handleSelect}
          isMulti
          placeholder="Select Class Subject"
        />
        <input
          className="test-form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Test Name"
        />
      </form>
      <Button type="submit" form="test-form">Create Test</Button>
    </div>
  );
}
