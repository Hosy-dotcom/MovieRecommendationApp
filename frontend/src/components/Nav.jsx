import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav>
      </nav>
  );
};

export default Nav;
