// Author: Ryan Bussert
// Chatroom page that displays messages and allows user to send messages
// 

import './css/ChatRoom.css';
import './css/firefly.sass'
import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import DynamicTextArea from './components/DynamicTextArea';
import { GrLinkUp } from "react-icons/gr";
import axios from 'axios';
import Overlay from './components/Overlay';
import { assignSlice} from './classes/messageHandler.js';
import PuffLoader from "react-spinners/PuffLoader"; // Import the loading spinner


function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [instructText, setInstructText] = useState('');
  const [command, setCommand] = useState('');
  const [newChatRoom, setNewChatRoom] = useState(true);
  const handleInstructTextChange = (e) => {
    setInstructText(e.target.value)
  }

  const scrollToBottom = () => {
    const scrollContainer = document.getElementById('scroll-container');
    scrollContainer.scrollTop = scrollContainer.scrollHeight; 
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const messageQuery = async (msg) => {
    try {
      const response = await axios.post('http://localhost:5000/', 
      { 
        content: msg, 
        command: command, 
        commandData: instructText, 
        isNewChatRoom: newChatRoom,
      },
    );
      setMessages(response.data);
      setNewChatRoom(false);
      
    } catch (error) {
      console.error('Error sending data:', error);
    }
    setIsLoading(false);
    setCommand('');
    setOverlayActive(false);
  }; 

  const sendMessage = (event) => {
    event.preventDefault();
    if (inputText !== '' && !isLoading) {
      let updatedMessages = [...messages];
      let text = inputText
      if(overlayActive && instructText !== '') {
        // updatedMessages = [...messages, assignMessage(instructText, command)];
        setInputText('');
        setInstructText('');
        setOverlayActive(false);
      }
      text = inputText.slice(assignSlice(inputText, command))
      setIsLoading(true);
      const newMessage = { role: "user", content: text, type: 'chat'};
      updatedMessages = [...updatedMessages, newMessage]; // Updated state
      setMessages(updatedMessages); // Update state
      setInputText('');
      messageQuery(text); // Pass updated state to messageQuery
      scrollToBottom();
    }
  };

  const updateText = (e) => {
    setInputText(e.target.value)
  }

  return (
    <div className="chat-room">
      {
       messages.length===0 ? Array.from({ length: 10  }, (_, index) => (
        <div className="firefly" key={index}></div>
      )) : <></>
    }

      {
      messages.length>0 && messages[0].role==='system' ?<div className="chat-header">
        <p>Instruction: {messages[0].content}</p>
      </div> : <></>
      }
      <div className="messages" id='scroll-container'>
        {messages.map((msg,i) => (i===0 && msg.role==='system') ? <></> 
        : <ChatMessage key={msg.id} text={msg.content} role={msg.role} type={msg.type}/>)
        }
      </div>
      <div className="overlay-container">
      <Overlay 
        isActive={overlayActive}  
        onInputChange={handleInstructTextChange}
        instruction={command}
        />
      <div className="input-area">
        <DynamicTextArea
          value={inputText}
          onChange={updateText}
          onKeyPress={(e) => e.key === 'Enter' ?  sendMessage(e) : null}
          onInstruct={(isActive) => {setOverlayActive(isActive)}}
          setCommand={setCommand}
          sendMessage={sendMessage}
          messageCount={messages.length}
        />
       { 
       isLoading ?
       <div className="loading-spinner">
            <PuffLoader size={25} color={"#ffffff"} loading={isLoading} />
          </div>
       : <button className={"send-button"} onClick={sendMessage}>
          <GrLinkUp style={{color:'white', width: '25', height: '25'}}/>
        </button>
        }
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
