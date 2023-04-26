import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";

export default function Chat({
  socket,
  username,
  chatroomIndex,
  logout,
  dbUser_id,
}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        chatroomIndex: chatroomIndex,
        author: username,
        user_id: dbUser_id,
        chatroom_id: chatroomIndex,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes().toString().padStart(2, "0"),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    let hasRun = false; // running twice on FE
    socket.on("load_messages", (data) => {
      console.log("loaded messages", data);
      if (!hasRun) setMessageList((list) => [...list, ...data]);
      hasRun = true;
    });
    // console.log(messageList);
  }, [socket]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessageList((list) => [...list, data]);
    });
    console.log(messageList);
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Class room {chatroomIndex}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent, index) => {
            return (
              <div
                key={index}
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder={username + " says"}
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}
