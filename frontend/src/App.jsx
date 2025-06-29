import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import MenuPage from './pages/MenuPage';
import TrackingPage from './pages/TrackingPage';
import ExplorePage from './pages/ExplorePage';
import MovieDetailPage from './pages/MovieDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AccountSettings from './pages/AccountSettingPage';

function App() {
  return (
    <div>
      <Routes>
        {/* Redirect from / to /menu */}
        <Route path="/" element={<Navigate to="/menu" replace />} />

        <Route path="/home" element={<Homepage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/account-settings" element={<AccountSettings />} />
      </Routes>
    </div>
  );
}

export default App;
