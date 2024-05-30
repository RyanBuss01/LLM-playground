import React, {useState, useEffect} from 'react';
import roboImage from './res/robo.png';
import personImage from './res/person.png';
import ReactMarkdown from 'react-markdown';
import './css/ChatMessage.css';

function ChatMessage({ text, role, type }) {
  const [url, setUrl] = useState('');

  const convertJsonToMarkdown = (data) => {
    let markdown = `# ${data.header}\n\n`;
    data.sections.forEach(section => {
      markdown += `## ${section.subHeader}\n\n${section.description}\n\n`;
    });
    return markdown;
  };
  
  useEffect(() => {
    if (type === 'image') {
      // Assuming the image name is passed in the text or some other way
      const imageName = text;  // Adjust this based on how you get the image name
      setUrl(`http://localhost:5000/image?image_name=${imageName}`);
    }
    if (type === 'music') {
      // Assuming the image name is passed in the text or some other way
      const musicName = text;  // Adjust this based on how you get the image name
      setUrl(`http://localhost:5000/music?music_name=${musicName}`);
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
        <img src={url} alt="Message Content" className="message-image" />
        : type === 'music' ? (
          <div className='audio-container'>
            <audio controls>
              <source src={url} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ) : type==='help' ? <div className='markdown-container'> 
        <ReactMarkdown className="markdown-content">{convertJsonToMarkdown(JSON.parse(text))}</ReactMarkdown>
       </div>
        : <div className='markdown-container'> 
          <ReactMarkdown className="markdown-content">{text}</ReactMarkdown>
         </div>

      }
    </div>
  );
}

export default ChatMessage;