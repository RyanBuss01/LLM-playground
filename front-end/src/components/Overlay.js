function Overlay({ isActive, onInputChange }) {
    if (!isActive) return null;
  

  
    return (
      <div className="instruct-overlay" >
        <div className="instruct-title">Enter Instruction: </div>
        <input
          className="instruct-text"
          type="text"
          placeholder="Type your instruction here..."
          onChange={onInputChange} // Use the passed handler
        />
      </div>
    );
  }
  
  export default Overlay;
  