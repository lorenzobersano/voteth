import React, { Component, Fragment } from 'react';

import {
  getNumberOfVerificationRequests,
  getVerificationRequestAt
} from '../../util/electionContractInteractions';
import { resolveIPFSHash } from './../../util/ipfsUtils';

import Container from './../container/Container';
import VerificationRequest from './../verificationRequest/VerificationRequest';
import { SpinnerWithInfo } from '../Spinner';

class VerifyVoters extends Component {
  constructor() {
    super();

    this.state = {
      verificationRequests: null
    };
  }

  isCancelled = false;

  componentDidMount() {
    this.getAllVerificationRequests();
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
    let verificationRequest, docPic;
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

          docPic = await resolveIPFSHash(
            verificationRequest[3].substring(
              1,
              verificationRequest[3].length - 1
            )
          );

          verificationRequests.push(
            <VerificationRequest
              requesterAddress={verificationRequest[0]}
              name={verificationRequest[1].substring(
                1,
                verificationRequest[1].length - 1
              )}
              voterPic={verificationRequest[2]}
              documentPic={docPic}
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
      <Fragment>
        <h2>Verification requests</h2>
        {this.state.verificationRequests ? (
          this.state.verificationRequests
        ) : (
          <SpinnerWithInfo info={'Loading verification requests...'} />
        )}
      </Fragment>
    );
  }
}

export default VerifyVoters;
