import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { decode, isMNID } from 'mnid';

import { resolveIPFSHash } from './../../util/ipfsUtils';

import {
  getNumberOfCandidates,
  getCandidateAt,
  getVerificationState,
  checkIfVoterHasCommittedVote,
  checkIfVoterHasRevealedVote,
  getElectionTimeRange,
  getElectionCurrentInstance
} from './../../util/electionContractInteractions';

// UI Components
import Candidate from '../candidate/Candidate';
import { SpinnerWithInfo } from '../Spinner';

const CandidatesHeaderText = styled.h2`
  color: #30292f;
`;

const mapStateToProps = state => {
  return {
    authData: state.user.data
  };
};

class Home extends Component {
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
    this.getElectionCurrentInstance();
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  async getElectionCurrentInstance() {
    if (this.currentElectionAddress === '')
      try {
        !this.isCancelled &&
          this.setState({ loadingText: 'Retrieving Election...' });

        this.currentElectionAddress = await getElectionCurrentInstance();

        if (this.props.authData && isMNID(this.props.authData.address))
          this.checkVoterState();
        this.getElectionTimeRange();
      } catch (error) {
        console.log(error);
      }
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

  async getElectionTimeRange() {
    let electionTimeRange = [];
    try {
      electionTimeRange = await getElectionTimeRange();
      this.getAllCandidates(electionTimeRange);
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
              electionStartTime={electionTimeRange[0].toNumber()}
              electionEndTime={electionTimeRange[1].toNumber()}
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
          <SpinnerWithInfo info={this.state.loadingText} />
        )}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(Home);
