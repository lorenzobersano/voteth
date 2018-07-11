import React, { Component, Fragment } from 'react';

import {
  getNumberOfVerificationRequests,
  getVerificationRequestAt
} from '../../util/electionContractInteractions';

import Container from './../container/Container';
import VerificationRequest from './../verificationRequest/VerificationRequest';

class VerifyVoters extends Component {
  constructor() {
    super();

    this.state = {
      verificationRequests: null
    };

    this.getAllVerificationRequests().catch(e => console.log(e));
  }

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

    if (numOfVerificationRequests == 0)
      verificationRequests = (
        <Fragment>No verification requests available!</Fragment>
      );
    else {
      for (i = 0; i < numOfVerificationRequests; i++) {
        try {
          verificationRequest = await getVerificationRequestAt(i);
          pic = await resolveIPFSHash(verificationRequest[2]);

          verificationRequests.push(
            <VerificationRequest
              name={verificationRequest[1]}
              documentPic={pic}
              key={i}
            />
          );
        } catch (e) {
          console.log(e);
        }
      }
    }

    this.setState({ verificationRequests });
  }

  render() {
    return (
      <Container>
        {this.state.verificationRequests
          ? this.state.verificationRequests
          : 'Loading...'}
      </Container>
    );
  }
}

export default VerifyVoters;
