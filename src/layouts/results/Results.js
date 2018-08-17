import React, { Component, Fragment } from 'react';

// UI Components
import Container from '../container/Container';
import {
  getElectionTimeRange,
  getCandidateAt,
  getVotesForCandidate,
  getNumberOfCandidates
} from '../../util/electionContractInteractions';
import { resolveIPFSHash } from '../../util/ipfsUtils';
import Result from '../result/Result';
import styled from '../../../node_modules/styled-components';
import { SpinnerWithInfo } from '../Spinner';

const ResultsHeading = styled.div`
  display: flex;
  justify-content: space-between;
`;

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
        electionEndTime <= parseInt(new Date().getTime() / 1000).toFixed(0) &&
        electionEndTime !== 0;

      !this.isCancelled && this.setState({ electionHasEnded });

      return Promise.resolve(electionHasEnded);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getElectionResults() {
    let numOfCandidates, i;
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

          candidates.push(
            <Result
              candidatePic={pic}
              candidateName={candidate[1]}
              candidateParty={candidate[2]}
              votes={votesForCandidate}
              key={i}
            />
          );
        }

        candidates.sort(
          (candidate1, candidate2) =>
            candidate2.props.votes - candidate1.props.votes
        );

        !this.isCancelled && this.setState({ candidates });
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <Fragment>
        <h2>Results</h2>
        <ResultsHeading>
          <h4>Candidates</h4>
          <h4>Votes</h4>
        </ResultsHeading>
        {this.state.candidates ? (
          this.state.candidates
        ) : this.state.electionHasEnded ? (
          <SpinnerWithInfo info={'Loading results...'} />
        ) : (
          <p>Results not available yet, come back later!</p>
        )}
      </Fragment>
    );
  }
}

export default Results;
