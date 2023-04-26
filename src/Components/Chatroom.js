import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Chat from "./Chat";
import { UserAuth } from "../Context/UserContext";
import "../Chat.css";

const socket = io.connect("http://localhost:8080");

export default function Chatroom() {
  // Use this to pull chatroom id to create room from url
  const [chatroomIndex, setChatroomIndex] = useState();
  // To replace with logged in user info after auth settled
  const [username, setUsername] = useState("");
  const [showChat, setShowChat] = useState(false);
  const { dbUser, loginButton } = UserAuth();

  useEffect(() => {
    console.log("dbUser", dbUser);
    if (dbUser !== null) {
      setUsername(dbUser.first_name);
      joinRoom();
    }
  });

  const params = useParams();
  if (chatroomIndex !== params.id) {
    setChatroomIndex(params.id);
  }

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  const joinRoom = () => {
    if (username !== "") {
      socket.emit("join_room", chatroomIndex);
      setShowChat(true);
    }
  };

  const logout = () => {
    setUsername("");
    setShowChat(false);
  };

  return (
    <div className="chat-comp">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Joining class chat...</h3>
          <div>
            {dbUser ? `${dbUser.first_name} is online` : "Loading user..."}
          </div>
        </div>
      ) : (
        <>
          <div>
            <Chat
              socket={socket}
              username={username}
              chatroomIndex={chatroomIndex}
              logout={logout}
              dbUser_id={dbUser.id}
            />
          </div>
        </>
      )}
    </div>
  );
}
