import React, { useState, useRef, useEffect } from 'react';

function DynamicTextArea({value, onChange, onKeyPress}) {
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset the height to recalibrate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight(); // Adjust the height initially and on every render
  });

  const handleChange = (event) => {
    adjustHeight();
    onChange(event)
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      style={{
        overflowY: 'hidden', // Hide the scrollbar
        minHeight: '20px', // Minimum height
        maxHeight: '500px', // Maximum expandable height
        resize: 'none', // Disable resizing (optional)
        borderRadius: '10px' // Border radius
      }}
      placeholder="Type something..."
      onKeyPress={onKeyPress}
    />
  );
}

export default DynamicTextArea;
