import React, { Component } from 'react';
import styled from 'styled-components';
import DateTimePicker from 'react-datetime-picker';
import { Button } from '@material-ui/core';

import Label from './../label/Label';
import Container from './../container/Container';
import Form from './../form/Form';

import { setElectionTimeRange } from './../../util/electionContractInteractions';

class SetElectionTimeRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: new Date(),
      endTime: new Date()
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();

    const startTimeTimestamp = parseInt(
      (this.state.startTime.getTime() / 1000).toFixed(0)
    );

    const endTimeTimestamp = parseInt(
      (this.state.endTime.getTime() / 1000).toFixed(0)
    );

    try {
      await setElectionTimeRange(
        startTimeTimestamp,
        endTimeTimestamp,
        this.props.authData.address
      );
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <Container>
        <Form onSubmit={this.handleSubmit}>
          <Label>Start time</Label>
          <DateTimePicker
            name="startTimePicker"
            onChange={date => this.setState({ startTime: date })}
            value={this.state.startTime}
            renderSecondHand={false}
            required
          />
          <Label>End time</Label>
          <DateTimePicker
            name="endTimePicker"
            onChange={date => this.setState({ endTime: date })}
            value={this.state.endTime}
            renderSecondHand={false}
            required
          />
          <Button type="submit">confirm</Button>
        </Form>
      </Container>
    );
  }
}

export default SetElectionTimeRange;
