import React from 'react';
import {Routes, Route } from 'react-router-dom';
import Homepage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import MenuPage from './pages/MenuPage';
import TrackingPage from './pages/TrackingPage';
import ExplorePage from './pages/ExplorePage';
import MovieDetailPage from './pages/MovieDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default App;
