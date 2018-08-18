import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { decode, isMNID } from 'mnid';

import { resolveIPFSHash } from '../../util/ipfsUtils';

import {
  getNumberOfCandidates,
  getCandidateAt,
  getVerificationState,
  checkIfVoterHasCommittedVote,
  checkIfVoterHasRevealedVote
} from '../../util/electionContractInteractions';

// UI Components
import Candidate from '../candidate/Candidate';
import { SpinnerWithInfo } from '../Spinner';

const CandidatesHeaderText = styled.h2`
  color: #30292f;
`;

const mapStateToProps = state => {
  return {
    authData: state.user.data,
    electionTimeRange: state.smartContracts.electionTimeRange
  };
};

class ElectionHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      candidates: null,
      userIsVerified: false,
      voterHasCommittedVote: false,
      voterHasRevealedVote: false,
      userAddress: null,
      loadingText: ''
    };
  }

  currentElectionAddress = '';
  isCancelled = false;

  componentDidMount() {
    if (this.props.authData && isMNID(this.props.authData.address))
      this.checkVoterState();
    this.getAllCandidates(this.props.electionTimeRange);
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  async checkVoterState() {
    try {
      const userIsVerified = await getVerificationState(
        decode(this.props.authData.address).address
      );

      const voterHasCommittedVote = await checkIfVoterHasCommittedVote(
        decode(this.props.authData.address).address
      );

      const voterHasRevealedVote = await checkIfVoterHasRevealedVote(
        decode(this.props.authData.address).address
      );

      !this.isCancelled &&
        this.setState({
          userIsVerified,
          voterHasCommittedVote,
          voterHasRevealedVote,
          userAddress: this.props.authData.address
        });
    } catch (e) {
      console.log(e);
    }
  }

  async getAllCandidates(electionTimeRange) {
    let numOfCandidates;
    let i;
    let candidate, pic;
    let candidates = [];

    !this.isCancelled &&
      this.setState({ loadingText: 'Retrieving candidates...' });

    try {
      numOfCandidates = await getNumberOfCandidates();
    } catch (e) {
      console.log(e);
    }

    if (numOfCandidates.toNumber() === 0)
      candidates = <Fragment>No candidates available!</Fragment>;
    else {
      for (i = 0; i < numOfCandidates.toNumber(); i++) {
        try {
          candidate = await getCandidateAt(i);
          pic = await resolveIPFSHash(candidate[0]);

          candidates.push(
            <Candidate
              name={candidate[1]}
              party={candidate[2]}
              politicalProgram={candidate[3]}
              photo={pic}
              key={i}
              userIsVerified={this.state.userIsVerified}
              voterHasCommittedVote={this.state.voterHasCommittedVote}
              voterHasRevealedVote={this.state.voterHasRevealedVote}
              voterAddress={this.state.userAddress}
              electionStartTime={electionTimeRange.electionStartTime}
              electionEndTime={electionTimeRange.electionEndTime}
            />
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    !this.isCancelled && this.setState({ candidates });
  }

  render() {
    return (
      <Fragment>
        <CandidatesHeaderText>Candidates</CandidatesHeaderText>
        {this.state.candidates ? (
          this.state.candidates
        ) : (
          <SpinnerWithInfo info={'Retrieving candidates...'} />
        )}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(ElectionHome);
