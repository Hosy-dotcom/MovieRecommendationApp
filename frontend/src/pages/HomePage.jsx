import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import { VscAccount } from "react-icons/vsc";


const Homepage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); 
    navigate("/menu");
  };

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Account Icon and Dropdown fixed to top-right */}
      <div className="account-dropdown" ref={dropdownRef}>
        <button
          className="account-button"
          onClick={() => setDropdownOpen(prev => !prev)}
        >
          <VscAccount />
        </button>
        {dropdownOpen && (
          <div className="dropdown-panel">
            <div className="dropdown-item"><strong>{username || "Guest"}</strong></div>
            <Link to="/account-settings" className="dropdown-item">Account Settings</Link>
            <hr className="dropdown-divider" />
            <button className="dropdown-item logout" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>

      <div className="container">
        <nav className="menu">
          <Link to="/create">Create New Movie</Link>
          <Link to="/tracking">Track/Explore unfinished Series</Link>
          <Link to="/explore">Explore Movies</Link>
        </nav>
      </div>
    </div>
  );
};

export default Homepage;
