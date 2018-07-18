import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import {
  removeVerificationRequestAt,
  verifyVoter
} from '../../util/electionContractInteractions';

const Card = styled.div`
  display: grid;
  grid-template-columns: auto;
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
  constructor(props) {
    super(props);
    this.approveRequest = this.approveRequest.bind(this);
    this.denyRequest = this.denyRequest.bind(this);
  }

  async approveRequest() {
    try {
      await verifyVoter(
        this.props.requesterAddress,
        1531916060,
        this.props.ownerAddress
      );

      await removeVerificationRequestAt(
        this.props.index,
        this.props.ownerAddress
      );
    } catch (e) {
      console.log(e);
    }
  }

  async denyRequest() {
    try {
      await removeVerificationRequestAt(
        this.props.index,
        this.props.ownerAddress
      );

      alert('Deleted!');
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <Card>
        <Avatar />
        <Name>{this.props.name}</Name>
        Identification Document
        <Document src={this.props.documentPic} />
        <Button variant="outlined" onClick={this.approveRequest}>
          Approve
        </Button>
        <Button variant="outlined" onClick={this.denyRequest}>
          Deny
        </Button>
      </Card>
    );
  }
}

export default VerificationRequest;
