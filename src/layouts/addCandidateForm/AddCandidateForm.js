import React, { Component } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

import { uploadToIPFS } from './../../util/ipfsUtils';
import { addCandidate } from './../../util/electionContractInteractions';

import Container from './../container/Container';
import Label from './../label/Label';
import Form from './../form/Form';

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

let file;
let reader;
let buffer;

class AddCandidateForm extends Component {
  async handleSubmit(e) {
    e.preventDefault();

    const name = document.querySelector('input[name="name"]').value;
    const party = document.querySelector('input[name="party"]').value;
    const politicalProgram = document.querySelector(
      'input[name="politicalProgram"]'
    ).value;

    try {
      const picHash = await uploadToIPFS(buffer);

      await addCandidate(picHash, name, party, politicalProgram);
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
            <Label htmlFor="party">Party</Label>
            <TextBox type="text" name="party" required />
            <Label htmlFor="politicalProgram">Political program</Label>
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
