import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import { VscAccount } from "react-icons/vsc";

const Homepage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/menu"); // ✅ Redirect to Menu
  };

  return (
    <div>
      <div className="container">
        <Link to="/menu" className="account-link">
          <VscAccount />
        </Link>
        <button onClick={handleLogout} style={{ float: "right", margin: "10px" }}>
          Logout
        </button>
        <nav className="menu">
          <Link to="/create">Create New Movie</Link>
          <Link to="/tracking">Track/Explore unfinished Series</Link>
          <Link to="/explore">Find New Movie</Link>
        </nav>
      </div>
    </div>
  );
};

export default Homepage;
