import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

const Card = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto auto auto;
  background: rgb(250, 250, 250);
  border: 1px solid #0000001e;
  margin-bottom: 16px;
  padding: 1rem;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.h2`
  margin: 0;
  font-size: 24px;
`;

const Document = styled.img`
  width: 100%;
  height: 3rem;
`;

class VerificationRequest extends Component {
  render() {
    return (
      <Card>
        <Avatar />
        <Name>Voter 1</Name>
        Identification Document
        <Document />
        <Button disabled={true} variant="outlined">
          Approve
        </Button>
        <Button disabled={true} variant="outlined">
          Deny
        </Button>
      </Card>
    );
  }
}

export default VerificationRequest;
