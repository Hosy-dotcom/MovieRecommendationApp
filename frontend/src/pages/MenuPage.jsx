import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MenuPage.css";

const MenuPage = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <div className="menu-content">
        <h1 className="menu-title">Personal Movie Recommendation App</h1>
        <div className="menu-buttons">
          <button onClick={() => navigate("/signup")}>Sign Up</button>
          <button onClick={() => navigate("/login")}>Log In</button>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
