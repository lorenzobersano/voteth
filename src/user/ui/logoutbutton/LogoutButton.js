import React from 'react';

const LogoutButton = ({ onLogoutUserClick }) => {
  return (
    <a href="#" onClick={event => onLogoutUserClick(event)}>
      Logout
    </a>
  );
};

export default LogoutButton;
