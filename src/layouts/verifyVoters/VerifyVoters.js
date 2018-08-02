import React, { Component, Fragment } from 'react';

import {
  getNumberOfVerificationRequests,
  getVerificationRequestAt
} from '../../util/electionContractInteractions';
import { resolveIPFSHash } from './../../util/ipfsUtils';

import Container from './../container/Container';
import VerificationRequest from './../verificationRequest/VerificationRequest';
import { SpinnerWithInfo } from '../Spinner';
import checkIfMetaMaskIsEnabled from '../../util/checkIfMetaMaskIsEnabled';

class VerifyVoters extends Component {
  constructor() {
    super();

    this.state = {
      verificationRequests: null
    };
  }

  isCancelled = false;

  componentDidMount() {
    setInterval(() => {
      checkIfMetaMaskIsEnabled();
    }, 1000);

    this.getAllVerificationRequests().catch(e => console.log(e));
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  deleteVerificationRequest = indexToDelete => {
    this.setState(({ verificationRequests }) => ({
      verificationRequests: verificationRequests.filter(
        verReq => parseInt(verReq.key) !== indexToDelete
      )
    }));
  };

  async getAllVerificationRequests() {
    let numOfVerificationRequests;
    let i;
    let verificationRequest, pic;
    let verificationRequests = [];

    try {
      numOfVerificationRequests = await getNumberOfVerificationRequests();
    } catch (e) {
      console.log(e);
    }

    if (numOfVerificationRequests.toNumber() === 0)
      verificationRequests = (
        <Fragment>No verification requests available!</Fragment>
      );
    else {
      for (i = 0; i < numOfVerificationRequests.toNumber(); i++) {
        try {
          verificationRequest = await getVerificationRequestAt(
            i,
            this.props.authData.address
          );
          pic = await resolveIPFSHash(
            verificationRequest[2].substring(
              1,
              verificationRequest[2].length - 1
            )
          );

          verificationRequests.push(
            <VerificationRequest
              requesterAddress={verificationRequest[0]}
              name={verificationRequest[1].substring(
                1,
                verificationRequest[1].length - 1
              )}
              documentPic={pic}
              key={i}
              index={i}
              ownerAddress={this.props.authData.address}
              delete={this.deleteVerificationRequest.bind(this, i)}
            />
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    !this.isCancelled && this.setState({ verificationRequests });
  }

  render() {
    return (
      <Container>
        <h2>Verification requests</h2>
        {this.state.verificationRequests ? (
          this.state.verificationRequests
        ) : (
          <SpinnerWithInfo info={'Loading verification requests...'} />
        )}
      </Container>
    );
  }
}

export default VerifyVoters;
