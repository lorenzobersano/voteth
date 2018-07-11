import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

import { requestVerification } from './../../util/electionContractInteractions';
import { uploadToIPFS } from './../../util/ipfsUtils';

import Container from '../container/Container';

const PhotoUploadButton = styled.input`
  outline: none;
  border: none;
  width: 100%;
`;

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

    if (!this.state.image) alert('Select an image of the document to submit!');
    else {
      try {
        const picHash = await uploadToIPFS(this.state.image);

        await requestVerification(
          this.props.authData.name,
          picHash,
          this.props.authData.deviceKey
        );

        alert('Verification request sent correctly!');
      } catch (error) {
        console.log(error);
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
        <h1>Upload a photo of your ID Document to get the ability to vote</h1>
        <PhotoUploadButton
          type="file"
          name="pic"
          onChange={this.handlePicUpload}
          required
        />
        <Button onClick={this.handleClick}>Upload</Button>
      </Container>
    );
  }
}

export default RequestVerification;
