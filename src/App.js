import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Error from "./Components/Error";
import Profile from "./Components/Profile";
import QuestionList from "./Components/QuestionList";
import Question from "./Components/Question";
import Chatroom from "./Components/Chatroom";
import Classes from "./Components/Classes";
import Subject from "./Components/Subject";
import ClassesList from "./Components/ClassesList";
import SubjectsList from "./Components/SubjectsList";
import { UserProvider } from "./Context/UserContext";

class App extends React.Component {
  render() {
    return (
      <UserProvider>
        <BrowserRouter>
          <div>
            <header>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/classes" element={<ClassesList />} />
                <Route path="/classes/:id" element={<Classes />} />
                <Route path="/subjects" element={<SubjectsList />} />
                <Route path="/subjects/:id" element={<Subject />} />
                <Route path="/questions" element={<QuestionList />} />
                <Route path="/questions/:id" element={<Question />} />
                <Route path="/chatroom/:id" element={<Chatroom />} />
                <Route path="/*" element={<Error />} />
              </Routes>
            </header>
          </div>
        </BrowserRouter>
      </UserProvider>
    );
  }
}

export default App;
