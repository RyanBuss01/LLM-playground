import {React, useState} from 'react';
import { Link } from 'react-router-dom';
import LogoHeader from './components/LogoHeader';
import { GrAdd } from "react-icons/gr";

function Sidebar({ isOpen }) {
  const [links, setLinks] = useState([
    { name: 'Home', path: '/' },
  ]);

  // New chat
  const handleClick = () => {
    console.log('New chat clicked');
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <LogoHeader />
      <div className="new-chat" onClick={handleClick}>
        <GrAdd style={{color:'white', marginRight: '10px', width: '25', height: '25'}}/>
        <div style={{color: 'white', fontSize: 20}}>New Chat</div>
      </div>
      {links.map((link, index) => (
        <Link key={index} to={link.path}>{link.name}</Link>
      ))}
    </div>
  );
}

export default Sidebar;
