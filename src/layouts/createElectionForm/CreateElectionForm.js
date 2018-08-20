import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import {
  createElection,
  deployElectionContract,
  deployElectionRegistryContract,
  setBackend
} from '../../util/electionsListContractInteractions';

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

class CreateElectionForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      isCreatingElection: false,
      loadingText: 'Deploying Election contract...'
    };
  }

  async handleSubmit(e) {
    e.preventDefault();

    this.setState({
      isCreatingElection: true
    });

    const name = document.querySelector('input[name="name"]').value;
    const description = document.querySelector('input[name="description"]')
      .value;

    try {
      await deployElectionContract();

      this.setState({
        loadingText: 'Deploying ElectionRegistry contract...'
      });

      await deployElectionRegistryContract();

      this.setState({
        loadingText: 'Setting backend contract...'
      });

      await setBackend();

      this.setState({
        loadingText: 'Creating election...'
      });

      await createElection(name, description);

      this.setState({ isCreatingElection: false });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <Fragment>
        <h2>Create election</h2>
        <Form onSubmit={this.handleSubmit}>
          <Label htmlFor="name">Name</Label>
          <TextBox type="text" name="name" required />
          <Label htmlFor="description">Description</Label>
          <TextBox type="text" name="description" required />
          <RightAlignedButton style={{ marginTop: '1rem' }} type="submit">
            Create election
          </RightAlignedButton>

          {this.state.isCreatingElection && (
            <SpinnerWithInfo info={this.state.loadingText} />
          )}
        </Form>
      </Fragment>
    );
  }
}

export default CreateElectionForm;
