import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import uploadToIPFS from './../../util/uploadToIPFS';

import Container from './../container/Container';

const Label = styled.label`
  font-size: 1em;
  align-self: flex-start;
`;

const TextBox = styled.input`
  outline: none;
  border: none;
  width: 100%;
  fill-opacity: 50%;
  font-size: 1.5em;
  border-radius: 1px;
`;

const PhotoUploadButton = styled.input`
  outline: none;
  border: none;
  width: 100%;
`;

const RightAlignedButton = styled(Button)`
  align-self: flex-end;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

let file;
let reader;
let buffer;

class AddCandidateForm extends Component {
  async handleSubmit(e) {
    e.preventDefault();

    try {
      const picHash = await uploadToIPFS(buffer);
      console.log(picHash);
    } catch (error) {
      console.log(error);
    }
  }

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
      <main>
        <Container>
          <Form onSubmit={this.handleSubmit}>
            <Label htmlFor="name">Name</Label>
            <TextBox type="text" name="name" required />
            <Label htmlFor="name">Party</Label>
            <TextBox type="text" name="party" required />
            <Label htmlFor="name">Political program</Label>
            <TextBox type="text" name="politicalProgram" required />
            <Label htmlFor="pic">Candidate pic</Label>
            <PhotoUploadButton
              type="file"
              name="pic"
              onChange={this.handlePicUpload}
              required
            />
            <RightAlignedButton type="submit">Add candidate</RightAlignedButton>
          </Form>
        </Container>
      </main>
    );
  }
}

export default AddCandidateForm;
