import React from 'react';
import styled from 'styled-components';

import warningSign from '../img/warning.svg';

const WarningWithInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

const WarningSign = styled.img`
  width: 25%;
  height: 25%;
`;

export default () => (
  <WarningWithInfo>
    <WarningSign src={warningSign} />
    <h1>Emergency stop enabled!</h1>
    <p>
      There has been some problem with the election, please wait for a fix, and
      sorry for the inconvenience.
    </p>
  </WarningWithInfo>
);
