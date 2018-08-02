import React, { Component } from 'react';
import styled from 'styled-components';

import { uploadToIPFS } from './../../util/ipfsUtils';
import { addCandidate } from './../../util/electionContractInteractions';

import Container from './../container/Container';
import Label from './../label/Label';
import Form from './../form/Form';
import RightAlignedButton from './../rightAlignedButton/RightAlignedButton';
import { SpinnerWithInfo } from '../Spinner';
import checkIfMetaMaskIsEnabled from '../../util/checkIfMetaMaskIsEnabled';

const TextBox = styled.input`
  outline: none;
  border: none;
  width: 100%;
  font-size: 1.5em;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  outline: none;
  border: none;
  width: 100%;
  resize: vertical;
  font-size: 1.5em;
  border-radius: 4px;
`;

const PhotoUploadButton = styled.input`
  outline: none;
  border: none;
  width: 100%;
`;

let file;
let reader;
let buffer;

class AddCandidateForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      isAddingCandidate: false,
      loaderText: 'Loading...'
    };
  }

  async handleSubmit(e) {
    e.preventDefault();

    this.setState({
      isAddingCandidate: true,
      loaderText: 'Uploading candidate picture to IPFS...'
    });

    const name = document.querySelector('input[name="name"]').value;
    const party = document.querySelector('input[name="party"]').value;
    const politicalProgram = document.querySelector(
      'textarea[name="politicalProgram"]'
    ).value;

    try {
      const picHash = await uploadToIPFS(buffer);

      picHash &&
        this.setState({ loaderText: 'Uploading candidate to Ethereum...' });

      await addCandidate(
        picHash,
        name,
        party,
        politicalProgram,
        this.props.authData.address
      );

      this.setState({ isAddingCandidate: false });
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
      <Form onSubmit={this.handleSubmit}>
        <Label htmlFor="name">Name</Label>
        <TextBox type="text" name="name" required />
        <Label htmlFor="party">Party</Label>
        <TextBox type="text" name="party" required />
        <Label htmlFor="politicalProgram">Political program</Label>
        <TextArea name="politicalProgram" required />
        <Label htmlFor="pic">Candidate pic</Label>
        <PhotoUploadButton
          type="file"
          name="pic"
          onChange={this.handlePicUpload}
          required
        />
        <RightAlignedButton type="submit">Add candidate</RightAlignedButton>

        {this.state.isAddingCandidate && (
          <SpinnerWithInfo info={this.state.loaderText} />
        )}
      </Form>
    );
  }
}

export default AddCandidateForm;
