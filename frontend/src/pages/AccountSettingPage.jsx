import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AccountSettingPage.css';

const AccountSettings = () => {
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [passwordForUsername, setPasswordForUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const api = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleUsernameToggle = () => {
    setShowUsernameForm((prev) => {
      if (!prev) setShowPasswordForm(false);
      return !prev;
    });
  };

  const handlePasswordToggle = () => {
    setShowPasswordForm((prev) => {
      if (!prev) setShowUsernameForm(false);
      return !prev;
    });
  };

  const handleUsernameChange = async () => {
    try {
      const response = await fetch(`${api}/api/auth/update-username`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          password: passwordForUsername,
          newUsername
        })
      });

      const result = await response.json();
      alert(result.message || "Username updated!");
      if (result.success) {
        localStorage.removeItem("token");
        window.location.href = "/menu";
      }
    } catch (err) {
      alert("Failed to update username");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${api}/api/auth/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      });

      const result = await response.json();
      alert(result.message || "Password updated!");

      if (result.success) {
        localStorage.removeItem("token");
        window.location.href = "/menu";
      }
    } catch (err) {
      alert("Failed to update password");
    }
  };

  return (
    <div className="account-settings-background">
      {/* Back button OUTSIDE container */}
      <button className="back-btn" onClick={() => navigate("/home")}>
        &larr; Back
      </button>

      <div className="account-settings-container">
        <h2>Account Settings</h2>

        <button className="action-btn" onClick={handleUsernameToggle}>
          Change Username
        </button>

        {showUsernameForm && (
          <div className="form-box">
            <input
              type="password"
              placeholder="Password"
              value={passwordForUsername}
              onChange={(e) => setPasswordForUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <div className="form-actions">
              <button onClick={handleUsernameChange}>Change</button>
            </div>
          </div>
        )}

        <button className="action-btn" onClick={handlePasswordToggle}>
          Change Password
        </button>

        {showPasswordForm && (
  <div className="form-box">
    <input
      type="password"
      placeholder="Current Password"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
    />
    <input
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
    <input
      type="password"
      placeholder="Confirm New Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />

    {/* Password mismatch warning */}
    {newPassword && confirmPassword && newPassword !== confirmPassword && (
      <p className="error-text">Passwords do not match.</p>
    )}

    <div className="form-actions">
      <button onClick={handlePasswordChange}>Change</button>
    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default AccountSettings;
