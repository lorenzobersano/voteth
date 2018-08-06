import React, { Component } from 'react';
import { isMNID, decode } from 'mnid';
import styled from 'styled-components';
import moment from 'moment';

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
import MetaMaskFox from './layouts/MetaMaskFox';

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
      isRetrievingElection: true,
      web3Undefined: false
    };
  }

  componentDidMount() {
    if (typeof web3 !== 'undefined') this.getCurrentBackend();
    else this.setState({ web3Undefined: true });
  }

  showInfo() {
    if (this.state.web3Undefined) return <MetaMaskFox toDownload={true} />;
    return <SpinnerWithInfo info={'Retrieving Election...'} />;
  }

  async getCurrentElectionTimeRange() {
    try {
      const electionTimeRange = await getElectionTimeRange();

      if (
        electionTimeRange[0].toNumber() !==
          this.props.electionTimeRange.electionStartTime ||
        electionTimeRange[1].toNumber() !==
          this.props.electionTimeRange.electionEndTime
      )
        this.props.electionTimeRangeSet(
          electionTimeRange[0].toNumber(),
          electionTimeRange[1].toNumber()
        );
    } catch (error) {
      console.log(error);
    }
  }

  async getCurrentBackend() {
    try {
      this.setState({ isRetrievingElection: true });

      this.currentElectionAddress = await getElectionCurrentInstance();

      const electionTimeRange = await getElectionTimeRange();

      this.props.electionTimeRangeSet(
        electionTimeRange[0].toNumber(),
        electionTimeRange[1].toNumber()
      );

      setInterval(() => this.getCurrentElectionTimeRange(), 2000);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ isRetrievingElection: false });
    }
  }

  render() {
    return (
      <main>
        {!this.state.isRetrievingElection && !this.state.web3Undefined ? (
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
          <FullHeightContainer>{this.showInfo()}</FullHeightContainer>
        )}
      </main>
    );
  }
}

export default App;
