import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import {
  removeVerificationRequestAt,
  verifyVoter
} from '../../util/electionContractInteractions';
import swal from 'sweetalert2';

const Card = styled.div`
  display: flex;
  flex-direction: column;
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

const Actions = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
`;

const Document = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
`;

const ButtonStyle = {
  marginLeft: '0.5rem'
};

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
        this.props.index,
        this.props.ownerAddress
      );

      this.props.delete();
      swal('Approved!', '', 'success');
    } catch (e) {
      console.log(e);
    }
  }

  async denyRequest() {
    try {
      const result = await removeVerificationRequestAt(
        this.props.index,
        this.props.ownerAddress
      );

      if (result) {
        this.props.delete();
        swal('Deleted!', '', 'success');
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <Card>
        <Name>{this.props.name}</Name>
        <p>Identification Document</p>
        <Document src={this.props.documentPic} />
        <Actions>
          <Button
            style={ButtonStyle}
            variant="outlined"
            onClick={this.approveRequest}
          >
            Approve
          </Button>
          <Button
            style={ButtonStyle}
            variant="outlined"
            onClick={this.denyRequest}
          >
            Deny
          </Button>
        </Actions>
      </Card>
    );
  }
}

export default VerificationRequest;
