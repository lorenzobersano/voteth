import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';

const HeaderTitleStyle = styled.h1`
  color: #02111b;
  font-family: 'Constantia', 'serif';
  font-weight: bold;
  font-size: 3rem;
`;

const HeaderTitle = ({ resetCurrentElectionContract }) => {
  return (
    <Link to="/" onClick={event => resetCurrentElectionContract(event)}>
      <HeaderTitleStyle>votΞ</HeaderTitleStyle>
    </Link>
  );
};

export default HeaderTitle;
