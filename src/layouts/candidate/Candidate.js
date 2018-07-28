import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { soliditySha3 } from 'web3-utils';
import swal from 'sweetalert2';
import {
  commitVote,
  revealVote
} from '../../util/electionContractInteractions';

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
  constructor(props) {
    super(props);
    console.log(props);

    this.handleVoteCommitClick = this.handleVoteCommitClick.bind(this);
    this.handleVoteRevealClick = this.handleVoteRevealClick.bind(this);
  }

  async handleVoteCommitClick() {
    const { value: password } = await swal({
      title: "Enter a secret password to commit the vote: don't forget it!",
      input: 'password',
      inputPlaceholder: 'Enter your password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      }
    });

    if (password) {
      const voteHash = soliditySha3(
        `'${this.props.name}-${this.props.voterAddress}-${password}'`
      );

      console.log(voteHash);

      try {
        await commitVote(voteHash, this.props.voterAddress);

        swal({
          type: 'success',
          title: 'Vote successfully committed',
          text: 'Come back later to confirm your vote!'
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async handleVoteRevealClick() {
    const { value: password } = await swal({
      title: 'Enter the secret password you entered before to reveal the vote',
      input: 'password',
      inputPlaceholder: 'Enter your password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      }
    });

    if (password) {
      const vote = `${this.props.name}-${this.props.voterAddress}-${password}`;
      const voteHash = soliditySha3(`'${vote}'`);

      console.log(vote);
      console.log(voteHash);

      try {
        const result = await revealVote(
          vote,
          voteHash,
          this.props.voterAddress
        );

        swal({
          type: 'success',
          title: 'Vote successfully revealed',
          text: 'Thank you for your vote!'
        });
      } catch (error) {
        swal({
          type: 'error',
          title: 'Ooops, something went wrong!',
          text: error
        });
      }
    }
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
          {parseInt(new Date().getTime() / 1000).toFixed(0) <
          this.props.electionEndTime ? (
            <Button
              style={ButtonStyle}
              onClick={this.handleVoteCommitClick}
              variant="outlined"
              disabled={
                (this.props.userIsVerified &&
                  this.props.voterHasCommittedVote) ||
                this.props.voterAddress === null
              }
            >
              Commit vote
            </Button>
          ) : (
            <Button
              style={ButtonStyle}
              onClick={this.handleVoteRevealClick}
              variant="outlined"
              disabled={
                (this.props.userIsVerified &&
                  this.props.voterHasRevealedVote) ||
                this.props.voterAddress === null
              }
            >
              Reveal vote
            </Button>
          )}
        </Actions>
      </Card>
    );
  }
}
