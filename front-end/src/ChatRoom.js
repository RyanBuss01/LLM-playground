// Author: Ryan Bussert
// Chatroom page that displays messages and allows user to send messages
// 

import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import DynamicTextArea from './components/DynamicTextArea';
import { GrLinkUp } from "react-icons/gr";
import axios from 'axios';
import Overlay from './components/Overlay';
import {assignMessage, assignSlice} from './classes/messageHandler.js';


function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [buttonActive, setButtonActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [instructText, setInstructText] = useState('');
  const [command, setCommand] = useState('');
  const [id, setId] = useState(0);
  const [newChatRoom, setNewChatRoom] = useState(true);
  const handleInstructTextChange = (e) => {
    setInstructText(e.target.value)
  }

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
    console.log(response.data)
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
        updatedMessages = [...messages, assignMessage(instructText, command)];
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
    }
  };

  const updateText = (e) => {
    setInputText(e.target.value)
    if(inputText !== '') {
      setButtonActive(false)
    } else {
      setButtonActive(true)
    }
  }

  return (
    <div className="chat-room">
      <div className="messages">
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
        <button className="send-button" onClick={sendMessage}>
          <GrLinkUp style={{color:'white', width: '25', height: '25'}}/>
        </button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
