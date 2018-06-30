import React, { Component } from 'react';
import styled from 'styled-components';

// UI Components
import Container from '../container/Container';
import Candidate from '../candidate/Candidate';

// Images
import luigidimaio from '../../img/candidates/luigidimaio.jpg';
import pietrograsso from '../../img/candidates/pietrograsso.jpg';

const CandidatesHeaderText = styled.h2`
  color: #30292f;
`;

class Home extends Component {
  render() {
    return (
      <main>
        <Container>
          <CandidatesHeaderText>Candidates</CandidatesHeaderText>
          <Candidate
            name="Luigi di Maio"
            party="Movimento 5 Stelle"
            photo={luigidimaio}
          />
          <Candidate
            name="Pietro Grasso"
            party="Liberi e Uguali"
            photo={pietrograsso}
          />
        </Container>
      </main>
    );
  }
}

export default Home;
