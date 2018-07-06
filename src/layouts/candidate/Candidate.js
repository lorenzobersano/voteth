import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

// UI Components
const Card = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto auto;
  background: rgb(250, 250, 250);
  border-radius: 4px;
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

const Description = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
`;

const DescriptionContainer = styled.div``;

const Name = styled.h2`
  margin: 0;
  font-size: 24px;
`;

const Party = styled.h4`
  margin: 0;
  font-size: 14px;
  color: gray;
`;

const PoliticalProgram = styled.div`
  grid-column: span 2;
  margin-top: 1rem;
`;

const Actions = styled.div`
  margin-top: 0.5rem;
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
`;

const ButtonStyle = {
  margin: '0 0 0 8px'
};

export default class Candidate extends Component {
  handleVoteClick(e) {
    console.log(e);
  }

  render() {
    return (
      <Card>
        <Avatar src={this.props.photo} alt="Candidate photo" />
        <Description>
          <DescriptionContainer>
            <Name>{this.props.name}</Name>
            <Party>{this.props.party}</Party>
          </DescriptionContainer>
        </Description>
        <PoliticalProgram>{this.props.politicalProgram}</PoliticalProgram>
        <Actions>
          <Button
            style={ButtonStyle}
            onClick={this.handleVoteClick}
            variant="outlined"
          >
            Vote
          </Button>
        </Actions>
      </Card>
    );
  }
}
