import React from 'react';
import roboImage from './res/robo.png';
import personImage from './res/person.png';

function ChatMessage({ text, role, type }) {
  console.log(text)
  return (
    <div className="chat-message">
      {/* <img src="https://www.w3schools.com/w3images/avatar2.png" alt="Avatar" className="avatar" /> */}
      {
      role==="user" ? <img src={personImage} alt="Avatar" className="avatar" />
        : <img src={roboImage} alt="Avatar" className="avatar" />
      }
      {
        type==='image' ? <img src={`/images/result.jpg`} alt="Message Content" className="message-image" />
        : <p>{text}</p>

      }
    </div>
  );
}

export default ChatMessage;