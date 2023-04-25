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
import { UserProvider } from "./Context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./Components/Navbar";
import Test from "./Components/Test";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <header className="App-header">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/class/" element={<Classes />} />
              <Route path="/tests" element={<Test />} />
              <Route path="/questions/:testId" element={<QuestionList />} />
              <Route path="/questions/:testId/:id" element={<Question />} />
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
