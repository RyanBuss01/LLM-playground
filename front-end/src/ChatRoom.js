import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import DynamicTextArea from './components/DynamicTextArea';
import { GrLinkUp } from "react-icons/gr";
import axios from 'axios';
import Overlay from './components/Overlay';
import InstructHandler from './classes/messageHandler.js';
const instructHandler = new InstructHandler();


function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [buttonActive, setButtonActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [instructText, setInstructText] = useState('');
  const [command, setCommand] = useState('');

  const handleInstructTextChange = (e) => {
    setInstructText(e.target.value)
  }

  const messageQuery = async (msgs) => {
    try {
      const response = await axios.post('http://localhost:5000/', { messages: msgs });
      setMessages([...msgs, { role: "system", content: response.data, id: messages.length }]);
    } catch (error) {
      console.error('Error sending data:', error);
    }
    setIsLoading(false);
  }; 

  const sendMessage = () => {
    if (inputText !== '' && !isLoading) {
      let updatedMessages = [...messages];
      let text = inputText
      if(overlayActive && instructText !== '') {
        updatedMessages = [...messages, instructHandler.assignMessage(instructText, command)];
        setInputText('');
        setInstructText('');
        setOverlayActive(false);
        text = inputText.slice(10);
      }

      setIsLoading(true);
      const newMessage = { role: "user", content: text, id: messages.length };
      updatedMessages = [...updatedMessages, newMessage]; // Updated state
      setMessages(updatedMessages); // Update state
      setInputText('');
      messageQuery(updatedMessages); // Pass updated state to messageQuery
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
        {messages.map((msg,i) => (i==0 && msg.role=='system') ? <></> : <ChatMessage key={msg.id} text={msg.content} role={msg.role}/>)}
      </div>
      <div className="overlay-container">
      <Overlay 
        isActive={overlayActive}  
        onInputChange={handleInstructTextChange}/>
      <div className="input-area">
        <DynamicTextArea
          value={inputText}
          onChange={updateText}
          onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
          onInstruct={(isActive) => {console.log(isActive);setOverlayActive(isActive)}}
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
