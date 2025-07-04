import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const API = import.meta.env.VITE_API_URL;


const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          email: formData.email.toLowerCase()
        })
      });

      const data = await res.json();
      if (data.success) {
        alert("Login successful!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        navigate("/home"); 
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
       <div className="back-button" onClick={() => navigate("/menu")}>
        &larr; Back
      </div>
      <div className="contents">
        <h2>Log In</h2>
        <form onSubmit={handleLogin}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
