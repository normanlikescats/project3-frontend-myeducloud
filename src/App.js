import "./App.css";
import React, { createContext, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Error from "./Components/Error";
import Profile from "./Components/Profile";
import QuestionList from "./Components/QuestionList";
import Question from "./Components/Question";
import Chatroom from "./Components/Chatroom";
import Classes from "./Components/Classes";
import Subject from "./Components/Subject";
import SubjectsList from "./Components/SubjectsList";
import { UserProvider } from "./Context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./Components/Navbar";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="App">
          <header>
            <NavBar />
          <header className="App-header">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/class/" element={<Classes />} />
              <Route path="/subjects" element={<SubjectsList />} />
              <Route path="/subjects/:id" element={<Subject />} />
              <Route path="/questions" element={<QuestionList />} />
              <Route path="/question/:id" element={<Question />} />
              <Route path="/chatroom/:id" element={<Chatroom />} />
              <Route path="/*" element={<Error />} />
            </Routes>
          </header>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
