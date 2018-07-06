import React, { Component, Fragment } from 'react';
import styled from 'styled-components';

import { resolveIPFSHash } from './../../util/ipfsUtils';
import {
  getNumberOfCandidates,
  getCandidateAt
} from './../../util/electionContractInteractions';

// UI Components
import Container from '../container/Container';
import Candidate from '../candidate/Candidate';

const CandidatesHeaderText = styled.h2`
  color: #30292f;
`;

class Home extends Component {
  constructor() {
    super();
    this.state = {
      candidates: null
    };

    this.getAllCandidates().catch(e => console.log(e));
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

    for (i = 0; i < numOfCandidates; i++) {
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
          />
        );
      } catch (e) {
        console.log(e);
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

export default Home;
