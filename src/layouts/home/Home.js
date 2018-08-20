import React, { Component, Fragment } from 'react';

import {
  getElectionAt,
  createElection,
  getNumberOfElections
} from '../../util/electionsListContractInteractions';

// UI Components
import Container from '../container/Container';
import styled from '../../../node_modules/styled-components';
import { SpinnerWithInfo } from '../Spinner';
import Election from '../election/Election';

const ResultsHeading = styled.div`
  display: flex;
  justify-content: space-between;
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elections: null
    };
  }

  isCancelled = false;

  componentDidMount() {
    this.getElections();
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  async getElections() {
    try {
      let elections = [];
      const numOfElections = await getNumberOfElections();
      for (let i = 0; i < numOfElections.toNumber(); i++) {
        const election = await getElectionAt(i);

        elections.push(
          <Election
            name={election[0]}
            description={election[1]}
            electionContract={election[2]}
            key={i}
          />
        );
      }

      !this.isCancelled && this.setState({ elections });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Fragment>
        <h2>Elections</h2>
        {this.state.elections ? (
          this.state.elections.length !== 0 ? (
            this.state.elections
          ) : (
            <p>No elections available, be the first to create one!</p>
          )
        ) : (
          <SpinnerWithInfo info={'Loading elections...'} />
        )}
      </Fragment>
    );
  }
}

export default Home;
