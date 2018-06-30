import React from 'react';

const LoginButton = ({ onLoginUserClick }) => {
  return (
    <a href="#" onClick={event => onLoginUserClick(event)}>
      Login
    </a>
  );
};

export default LoginButton;
