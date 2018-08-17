import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import Switch from '@material-ui/core/Switch';
import swal from 'sweetalert2';
import { isAddress } from 'web3-utils';

import { SpinnerWithInfo } from './../Spinner';
import Label from './../label/Label';
import Form from './../form/Form';
import RightAlignedButton from './../rightAlignedButton/RightAlignedButton';
import {
  checkIfStopped,
  changeBackend,
  toggleCircuitBreaker
} from '../../util/electionContractInteractions';

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

    if (!isAddress(newAddress))
      swal(
        'Invalid address',
        'Please insert a valid contract address',
        'error'
      );
    else {
      !this.isCancelled && this.setState({ isChangingBackendContract: true });

      try {
        const result = await changeBackend(
          newAddress,
          this.props.authData.address
        );

        if (result) {
          this.setToggleState();
          swal('Ok!', `Changed contract location to ${newAddress}`, 'success');
        }
      } catch (error) {
        console.log(error);

        swal('Oooops!', `${error}`, 'error');
      } finally {
        !this.isCancelled &&
          this.setState({ isChangingBackendContract: false });
      }
    }
  }

  render() {
    return (
      <Fragment>
        <h2>Handle emergency</h2>
        <Form onSubmit={this.handleSubmit}>
          <Label htmlFor="emergencyStopSwitch">
            Emergency stop status:{' '}
            {this.state.isStopped ? (
              <strong>
                STOPPED{' '}
                <Switch
                  name="emergencyStopSwitch"
                  checked={this.state.isStopped}
                  onChange={this.handleCheck}
                />
              </strong>
            ) : (
              <strong>
                UNSTOPPED{' '}
                <Switch
                  name="emergencyStopSwitch"
                  checked={this.state.isStopped}
                  onChange={this.handleCheck}
                />
              </strong>
            )}
          </Label>

          {this.state.isChangingEmergencyState && (
            <SpinnerWithInfo
              info={
                this.state.isStopped
                  ? 'Reverting Election contract to a non-emergency state...'
                  : 'Enabling emergency stop...'
              }
            />
          )}
          <Label htmlFor="electionAddress">
            Fixed Election contract address
          </Label>
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
      </Fragment>
    );
  }
}

export default HandleEmergency;
