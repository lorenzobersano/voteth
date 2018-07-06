import React, { Component } from 'react';

import Container from './../container/Container';
import VerificationRequest from './../verificationRequest/VerificationRequest';

class VerifyVoters extends Component {
  render() {
    return (
      <Container>
        <VerificationRequest />
      </Container>
    );
  }
}

export default VerifyVoters;
