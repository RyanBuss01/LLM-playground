import React from 'react';

function ChatMessage({ text }) {
  return (
    <div className="chat-message">
      {/* <img src="avatar.png" alt="Avatar" className="avatar" /> */}
      <img src="https://www.w3schools.com/w3images/avatar2.png" alt="Avatar" className="avatar" />
      <p>{text}</p>
    </div>
  );
}

export default ChatMessage;