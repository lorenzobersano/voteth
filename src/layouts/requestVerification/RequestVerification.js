import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../container/Container';

const PhotoUploadButton = styled.input`
  outline: none;
  border: none;
  width: 100%;
`;

class RequestVerification extends Component {
  handlePicUpload() {
    file = document.querySelector('input[type=file]').files[0];
    reader = new FileReader();

    if (file) {
      reader.readAsArrayBuffer(file);
      reader.onloadend = async () =>
        (buffer = await Buffer.from(reader.result));
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
      </Container>
    );
  }
}

export default RequestVerification;
