import React, { Component } from 'react';

// UI Components
import Container from '../container/Container';
import {
  getElectionTimeRange,
  getCandidateAt,
  getVotesForCandidate,
  getNumberOfCandidates
} from '../../util/electionContractInteractions';
import { resolveIPFSHash } from '../../util/ipfsUtils';

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      electionHasEnded: false,
      candidates: null
    };
  }

  isCancelled = false;

  componentDidMount() {
    this.checkIfElectionHasEnded()
      .then(electionHasEnded => {
        if (electionHasEnded) this.getElectionResults();
      })
      .catch(e => console.log(e));
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  async checkIfElectionHasEnded() {
    try {
      const electionTimeRange = await getElectionTimeRange();
      const electionEndTime = electionTimeRange[1].toNumber();
      const electionHasEnded =
        electionEndTime <= parseInt(new Date().getTime() / 1000).toFixed(0);

      !this.isCancelled && this.setState({ electionHasEnded });

      return Promise.resolve(electionHasEnded);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getElectionResults() {
    let numOfCandidates;
    let i;
    let candidate, pic, votesForCandidate;
    let candidates = [];

    try {
      numOfCandidates = await getNumberOfCandidates();

      if (numOfCandidates.toNumber() === 0)
        candidates = <Fragment>No candidates available!</Fragment>;
      else {
        for (i = 0; i < numOfCandidates.toNumber(); i++) {
          candidate = await getCandidateAt(i);
          pic = await resolveIPFSHash(candidate[0]);
          votesForCandidate = await getVotesForCandidate(`'${candidate[1]}`);

          console.log(candidate);
          console.log(votesForCandidate);

          candidates.push(
            <div key={i}>
              <h2>{candidate[1]}</h2>
              <p>{votesForCandidate}</p>
            </div>
          );

          !this.isCancelled && this.setState({ candidates });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <main>
        <Container>
          <h1>Results</h1>
          {this.state.candidates ? this.state.candidates : <p>Loading...</p>}
        </Container>
      </main>
    );
  }
}

export default Results;
