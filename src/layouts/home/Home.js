import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { decode, isMNID } from 'mnid';

import { resolveIPFSHash } from './../../util/ipfsUtils';

import {
  getNumberOfCandidates,
  getCandidateAt,
  getVerificationState,
  checkIfVoterHasVoted,
  getElectionTimeRange
} from './../../util/electionContractInteractions';

// UI Components
import Container from '../container/Container';
import Candidate from '../candidate/Candidate';

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
      userAddress: null,
      electionTimeRange: []
    };
  }

  isCancelled = false;

  componentDidMount() {
    if (this.props.authData && isMNID(this.props.authData.address))
      this.checkVoterState();
    this.getElectionTimeRange();
    this.getAllCandidates().catch(e => console.log(e));
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  async checkVoterState() {
    try {
      const userIsVerified = await getVerificationState(
        decode(this.props.authData.address).address
      );

      const voterHasVoted = await checkIfVoterHasVoted(
        decode(this.props.authData.address).address
      );

      console.log(voterHasVoted);

      !this.isCancelled &&
        this.setState({
          userIsVerified,
          voterHasVoted,
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
    } catch (e) {
      console.log(e);
    }

    !this.isCancelled && this.setState({ electionTimeRange });
  }

  async getAllCandidates() {
    let numOfCandidates;
    let i;
    let candidate, pic;
    let candidates = [];

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
              voterHasVoted={this.state.voterHasVoted}
              voterAddress={this.state.userAddress}
              electionStartTime={this.state.electionTimeRange[0].toNumber()}
              electionEndTime={this.state.electionTimeRange[1].toNumber()}
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
      <main>
        <Container>
          <CandidatesHeaderText>Candidates</CandidatesHeaderText>
          {this.state.candidates ? this.state.candidates : 'Loading...'}
        </Container>
      </main>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(Home);
