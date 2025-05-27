import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();

  // Function to determine if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav>
      </nav>
  );
};

export default Nav;
