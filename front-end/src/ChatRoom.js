import React, { useState } from 'react';
import ChatMessage from './ChatMessage';
import DynamicTextArea from './components/DynamicTextArea';
import { GrLinkUp } from "react-icons/gr";

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [buttonActive, setButtonActive] = useState(false);

  const sendMessage = () => {
    if (inputText !== '') {
      const newMessage = { text: inputText, id: messages.length };
      setMessages([...messages, newMessage]);
      setInputText('');
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
        {messages.map(msg => <ChatMessage key={msg.id} text={msg.text} />)}
      </div>
      <div className="input-area">
        <DynamicTextArea
          value={inputText}
          onChange={updateText}
          onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
          sendMessage={sendMessage}
        />
        <button className="send-button" onClick={sendMessage}>
          <GrLinkUp style={{color:'white', width: '25', height: '25'}}/>
        </button>
      </div>
    </div>
  );
}

export default ChatRoom;
