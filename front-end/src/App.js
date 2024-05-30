import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatRoom from './ChatRoom';
import './css/App.css';

const ArrowIcon = ({ isOpen }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {isOpen ? (
      <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="App" style={{ paddingLeft: isSidebarOpen ? '200px' : '0' }}>
        <Sidebar isOpen={isSidebarOpen} onClick={toggleSidebar}/>
        <button className={`toggle-button ${isSidebarOpen ? '' : 'collapsed'}`} onClick={toggleSidebar}>
          <ArrowIcon isOpen={isSidebarOpen} />
        </button>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<ChatRoom />} />
            {/* Other routes */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
