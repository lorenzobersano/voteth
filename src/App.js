import React, { Component, Fragment } from 'react';
import { isMNID, decode } from 'mnid';
import styled from 'styled-components';
import moment from 'moment';

import { electionAddress } from './util/electionContractInteractions';

// UI Components
import Header from './layouts/header/Header';

// Styles
import './css/oswald.css';
import './css/open-sans.css';
import './App.css';
import Container from './layouts/container/Container';
import {
  getElectionTimeRange,
  getElectionCurrentInstance
} from './util/electionContractInteractions';
import { SpinnerWithInfo } from './layouts/Spinner';

const FullHeightContainer = styled(Container)`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRetrievingElection: true
    };
  }

  componentDidMount() {
    this.getCurrentBackend();
  }

  async getCurrentBackend() {
    if (electionAddress === undefined)
      try {
        this.setState({ isRetrievingElection: true });

        this.currentElectionAddress = await getElectionCurrentInstance();

        const electionTimeRange = await getElectionTimeRange();

        this.props.electionTimeRangeSet(
          electionTimeRange[0].toNumber(),
          electionTimeRange[1].toNumber()
        );
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ isRetrievingElection: false });
      }
  }

  render() {
    return (
      <main>
        {!this.state.isRetrievingElection ? (
          <Container>
            {this.props.authData && (
              <p>
                <strong>Current account:</strong>{' '}
                {!isMNID(this.props.authData.address)
                  ? this.props.authData.address
                  : decode(this.props.authData.address).address}
              </p>
            )}
            {this.props.electionTimeRange &&
              this.props.electionTimeRange.electionStartTime !== 0 &&
              this.props.electionTimeRange.electionEndTime !== 0 && (
                <p>
                  Election will start{' '}
                  <strong>
                    {moment
                      .unix(this.props.electionTimeRange.electionStartTime)
                      .local()
                      .format('D/M/YYYY hh:mm A')}{' '}
                  </strong>{' '}
                  and will end{' '}
                  <strong>
                    {moment
                      .unix(this.props.electionTimeRange.electionEndTime)
                      .local()
                      .format('D/M/YYYY hh:mm A')}{' '}
                  </strong>
                </p>
              )}
            <Header />
            {this.props.children}
          </Container>
        ) : (
          <FullHeightContainer>
            <SpinnerWithInfo info={'Retrieving Election...'} />
          </FullHeightContainer>
        )}
      </main>
    );
  }
}

export default App;
