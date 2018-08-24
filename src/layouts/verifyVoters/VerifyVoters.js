import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import {
  getNumberOfVerificationRequests,
  getVerificationRequestAt
} from '../../util/electionContractInteractions';
import { resolveIPFSHash, bytes32ToIPFSHash } from './../../util/ipfsUtils';

import VerificationRequest from './../verificationRequest/VerificationRequest';
import { SpinnerWithInfo } from '../Spinner';

const mapStateToProps = state => {
  return {
    electionStartTime: state.smartContracts.electionTimeRange.electionStartTime
  };
};

class VerifyVoters extends Component {
  constructor() {
    super();

    this.state = {
      verificationRequests: null,
      electionHasAlreadyStarted: false,
      electionTimeRangeNotConfigured: false
    };
  }

  isCancelled = false;

  componentDidMount() {
    if (this.props.electionStartTime === 0) {
      !this.isCancelled &&
        this.setState({ electionTimeRangeNotConfigured: true });
    } else if (
      parseInt((new Date().getTime() / 1000).toFixed(0)) >=
      this.props.electionStartTime
    )
      !this.isCancelled && this.setState({ electionHasAlreadyStarted: true });
    else this.getAllVerificationRequests();
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
    let verificationRequest, docPic, profilePic;
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

          console.log(verificationRequest);

          profilePic = await resolveIPFSHash(verificationRequest[2]);
          docPic = await resolveIPFSHash(verificationRequest[3]);

          verificationRequests.push(
            <VerificationRequest
              requesterAddress={verificationRequest[0]}
              name={verificationRequest[1].substring(
                1,
                verificationRequest[1].length - 1
              )}
              voterPic={profilePic}
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
        {this.state.electionHasAlreadyStarted ||
        this.state.electionTimeRangeNotConfigured ? (
          <p>
            {this.state.electionTimeRangeNotConfigured
              ? 'Election time range still has to be configured.'
              : 'Election has already started!'}
          </p>
        ) : this.state.verificationRequests ? (
          this.state.verificationRequests
        ) : (
          <SpinnerWithInfo info={'Loading verification requests...'} />
        )}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(VerifyVoters);
