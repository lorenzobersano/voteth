import React, { Component, Fragment } from 'react';
import swal from 'sweetalert2';

import {
  requestVerification,
  getVerificationState
} from './../../util/electionContractInteractions';
import { uploadToIPFS } from './../../util/ipfsUtils';

import Container from '../container/Container';
import RightAlignedButton from './../rightAlignedButton/RightAlignedButton';
import { MNID } from '../../../node_modules/uport-connect';

class RequestVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      userIsVerified: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handlePicUpload = this.handlePicUpload.bind(this);
  }

  isCancelled = false;

  async componentDidMount() {
    try {
      const userIsVerified = await getVerificationState(
        MNID.decode(this.props.authData.address).address
      );

      !this.isCancelled && this.setState({ userIsVerified });
    } catch (error) {
      console.log(e);
    }
  }

  async handleClick(e) {
    e.preventDefault();

    if (!this.state.image) swal('Select an image to submit!', '', 'warning');
    else {
      try {
        const picHash = await uploadToIPFS(this.state.image);

        await requestVerification(
          this.props.authData.name,
          picHash,
          this.props.authData.address
        );

        swal('Verification request sent correctly!', '', 'success');
      } catch (error) {
        swal(error, '', 'error');
      }
    }
  }

  handlePicUpload() {
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsArrayBuffer(file);
      reader.onloadend = async () => {
        const buffer = await Buffer.from(reader.result);
        this.setState({ image: buffer });
      };
    }
  }

  render() {
    return (
      <Fragment>
        <h2>Request verification</h2>
        {!this.state.userIsVerified ? (
          <Fragment>
            <p>Upload a photo of your ID Document to get the ability to vote</p>
            <input
              type="file"
              name="pic"
              onChange={this.handlePicUpload}
              required
            />
            <RightAlignedButton onClick={this.handleClick}>
              Upload
            </RightAlignedButton>
          </Fragment>
        ) : (
          <p>You're already verified!</p>
        )}
      </Fragment>
    );
  }
}

export default RequestVerification;
