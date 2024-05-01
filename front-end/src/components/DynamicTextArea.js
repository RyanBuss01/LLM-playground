import React, { useState, useRef, useEffect } from 'react';
import InstructHandler from '../classes/messageHandler.js';
const instructHandler = new InstructHandler();

function DynamicTextArea({ value, onChange, onKeyPress, onInstruct, messageCount, setCommand}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

 const handleChange = (event) => {
    const inputValue = event.target.value;
    // Check if the input starts with '/instruct'
    if (instructHandler.instructArray.some(prefix => inputValue.startsWith(prefix + ' '))) {
      const command = instructHandler.commandAssigner(inputValue);
      setCommand(command); // Set the command to the commandAssigner function
      onInstruct(true);
    } else {
      onInstruct(false);
    }
    onChange(event); // Trigger the onChange passed down from the parent
};

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace' && instructHandler.instructArray.includes(value)  && messageCount == 0) {
      const newValue = value.slice(0, -9); // Remove '/instruct' from value
      onChange({ target: { value: newValue } });
      onInstruct(false);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      style={{
        overflowY: 'hidden',
        minHeight: '20px',
        maxHeight: '500px',
        resize: 'none',
        borderRadius: '10px'
      }}
      placeholder="Type something..."
      onKeyPress={onKeyPress}
    />
  );
}

export default DynamicTextArea;
