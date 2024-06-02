'use client';
import Image from "next/image";
// import ScrollToBottom from "react-scroll-to-bottom";
import { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3001");

type Message = {
  room?: string;
  time: string,
  message: string,
  author: string
}

export default function Home() {

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  
  const sendMessage = async () => {  
    console.log(currentMessage);
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
    
  }
  //TODO: have to send the room by socket.io

  useEffect(() => {
    socket.on("receive_message", (data) => {      
      setMessageList((list) => [...list, data]);
      
    })
  
    // return () => {
    //   second
    // }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])
  
  console.log(messageList);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="flex flex-row items-center space-between">
        <input
          type="text"
          placeholder="User name..."
          className="p-2 border border-gray-300 rounded-md"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="p-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={sendMessage}
        >
          Login
        </button>
      
      </section> 
      <section className="flex flex-row items-center space-between">
        <input
          type="text"
          placeholder="Message..."
          className="p-2 border border-gray-300 rounded-md"
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button
          className="p-2 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send message
        </button>
        <h1>{messageReceived}</h1> 
      </section>    
      <div className="chat-body">
        <div className="message-container">
          {messageList.map((messageContent,index) => {
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
        </div>
      </div> 
    </main>
  );
}
