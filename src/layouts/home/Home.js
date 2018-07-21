import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { decode, isMNID } from 'mnid';

import { resolveIPFSHash } from './../../util/ipfsUtils';

import {
  getNumberOfCandidates,
  getCandidateAt,
  getVerificationState
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
      userAddress: null
    };
  }

  componentDidMount() {
    if (this.props.authData && isMNID(this.props.authData.address))
      this.checkVerificationState();
    this.getAllCandidates().catch(e => console.log(e));
  }

  async checkVerificationState() {
    try {
      const userIsVerified = await getVerificationState(
        decode(this.props.authData.address).address
      );

      console.log(userIsVerified);

      this.setState({
        userIsVerified,
        userAddress: this.props.authData.address
      });
    } catch (e) {
      console.log(e);
    }
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
              voterAddress={this.state.userAddress}
            />
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    this.setState({ candidates });
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
