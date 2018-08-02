import React, { Component } from 'react';
import styled from 'styled-components';
import Switch from '@material-ui/core/Switch';

import { SpinnerWithInfo } from './../Spinner';
import Container from './../container/Container';
import Label from './../label/Label';
import Form from './../form/Form';
import RightAlignedButton from './../rightAlignedButton/RightAlignedButton';
import {
  checkIfStopped,
  changeBackend,
  toggleCircuitBreaker
} from '../../util/electionContractInteractions';
import swal from 'sweetalert2';

const TextBox = styled.input`
  outline: none;
  border: none;
  width: 100%;
  font-size: 1.5em;
  border-radius: 4px;
`;

const submitButtonStyle = {
  marginTop: '0.5rem'
};

class HandleEmergency extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      isStopped: false,
      isChangingEmergencyState: false,
      isChangingBackendContract: false
    };

    this.handleCheck = this.handleCheck.bind(this);
  }

  isCancelled = false;

  async setToggleState() {
    try {
      const isStopped = await checkIfStopped();
      !this.isCancelled && this.setState({ isStopped });
    } catch (error) {
      console.log(error);
    }
  }

  isCancelled = false;

  componentDidMount() {
    this.setToggleState();
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  async handleCheck(e) {
    !this.isCancelled && this.setState({ isChangingEmergencyState: true });

    try {
      await toggleCircuitBreaker(this.props.authData.address);

      this.setToggleState();
    } catch (error) {
      swal('Oooops!', `${error}`, 'error');
    } finally {
      !this.isCancelled && this.setState({ isChangingEmergencyState: false });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const newAddress = document.querySelector('input[name="electionAddress"]')
      .value;

    !this.isCancelled && this.setState({ isChangingBackendContract: true });

    try {
      const result = await changeBackend(
        newAddress,
        this.props.authData.address
      );

      if (result)
        swal('Ok!', `Changed contract location to ${newAddress}`, 'success');
    } catch (error) {
      swal('Oooops!', error, 'error');
    } finally {
      !this.isCancelled && this.setState({ isChangingBackendContract: false });
    }
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Label htmlFor="emergencyStopSwitch">
          Emergency stop status:{' '}
          {this.state.isStopped ? (
            <strong>STOPPED</strong>
          ) : (
            <strong>UNSTOPPED</strong>
          )}
        </Label>
        <Switch
          name="emergencyStopSwitch"
          checked={this.state.isStopped}
          onChange={this.handleCheck}
        />
        {this.state.isChangingEmergencyState && (
          <SpinnerWithInfo
            info={
              this.state.isStopped
                ? 'Reverting Election contract to a non-emergency state...'
                : 'Enabling emergency stop...'
            }
          />
        )}
        <Label htmlFor="electionAddress">Fixed Election contract address</Label>
        <TextBox
          type="text"
          disabled={!this.state.isStopped}
          name="electionAddress"
          required
        />
        <RightAlignedButton
          style={submitButtonStyle}
          disabled={!this.state.isStopped}
          type="submit"
        >
          Submit
        </RightAlignedButton>

        {this.state.isChangingBackendContract && (
          <SpinnerWithInfo info={'Changing backend contract...'} />
        )}
      </Form>
    );
  }
}

export default HandleEmergency;
