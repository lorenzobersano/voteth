import React, { Component } from 'react';
import swal from 'sweetalert2';

import { requestVerification } from './../../util/electionContractInteractions';
import { uploadToIPFS } from './../../util/ipfsUtils';

import Container from '../container/Container';
import RightAlignedButton from './../rightAlignedButton/RightAlignedButton';

class RequestVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null
    };

    this.handleClick = this.handleClick.bind(this);
    this.handlePicUpload = this.handlePicUpload.bind(this);
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
      <Container>
        <h2>Upload a photo of your ID Document to get the ability to vote</h2>
        <input
          type="file"
          name="pic"
          onChange={this.handlePicUpload}
          required
        />
        <RightAlignedButton onClick={this.handleClick}>
          Upload
        </RightAlignedButton>
      </Container>
    );
  }
}

export default RequestVerification;
