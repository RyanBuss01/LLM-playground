import React, {useState, useEffect} from 'react';
import roboImage from './res/robo.png';
import personImage from './res/person.png';
import ReactMarkdown from 'react-markdown';
import './css/ChatMessage.css';

function ChatMessage({ text, role, type }) {
  const [imageUrl, setImageUrl] = useState('');
  
  useEffect(() => {
    if (type === 'image') {
      // Assuming the image name is passed in the text or some other way
      const imageName = text;  // Adjust this based on how you get the image name
      setImageUrl(`http://localhost:5000/image?image_name=${imageName}`);
    }
  }, [type, text]);


  return (
    <div className="chat-message">
      {
      /* <img src="https://www.w3schools.com/w3images/avatar2.png" alt="Avatar" className="avatar" /> */}
      {
      role==="user" ? <img src={personImage} alt="Avatar" className="avatar" />
        : <img src={roboImage} alt="Avatar" className="avatar" />
      }
      {
        type==='image' ?
        <img src={imageUrl} alt="Message Content" className="message-image" />
        : <div className=''> 
          <ReactMarkdown>{text}</ReactMarkdown>
         </div>

      }
    </div>
  );
}

export default ChatMessage;