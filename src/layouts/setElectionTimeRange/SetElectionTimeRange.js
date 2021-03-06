import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';

import Label from './../label/Label';
import Form from './../form/Form';
import RightAlignedButton from './../rightAlignedButton/RightAlignedButton';

import { setElectionTimeRange } from './../../util/electionContractInteractions';
import swal from 'sweetalert2';
import { SpinnerWithInfo } from '../Spinner';

const StyledDateTimePicker = styled(DateTimePicker)`
  background-color: white;
`;

class SetElectionTimeRange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime:
        props.electionTimeRange &&
        props.electionTimeRange.electionStartTime !== 0
          ? moment
              .unix(this.props.electionTimeRange.electionStartTime)
              .local()
              .toDate()
          : new Date(),
      endTime:
        props.electionTimeRange && props.electionTimeRange.electionEndTime !== 0
          ? moment
              .unix(this.props.electionTimeRange.electionEndTime)
              .local()
              .toDate()
          : new Date(),
      isSettingTimeRange: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isCancelled = false;

  componentDidMount() {}

  componentWillUnmount() {
    this.isCancelled = true;
  }

  async handleSubmit(e) {
    e.preventDefault();

    const startTimeTimestamp = parseInt(
      (this.state.startTime.getTime() / 1000).toFixed(0)
    );

    const endTimeTimestamp = parseInt(
      (this.state.endTime.getTime() / 1000).toFixed(0)
    );

    !this.isCancelled && this.setState({ isSettingTimeRange: true });

    try {
      await setElectionTimeRange(
        startTimeTimestamp,
        endTimeTimestamp,
        this.props.authData.address
      );

      this.props.electionTimeRangeSet(startTimeTimestamp, endTimeTimestamp);

      swal('Election time range correctly set!', '', 'success');
    } catch (e) {
      swal('Ooops!', `${e}`, 'error');
    } finally {
      !this.isCancelled && this.setState({ isSettingTimeRange: false });
    }
  }

  render() {
    return (
      <Fragment>
        <h2>Set election time range</h2>
        <Form onSubmit={this.handleSubmit}>
          <Label>Start time</Label>
          <StyledDateTimePicker
            name="startTimePicker"
            onChange={date => this.setState({ startTime: date })}
            value={this.state.startTime}
            renderSecondHand={false}
            required
          />
          <Label>End time</Label>
          <StyledDateTimePicker
            name="endTimePicker"
            onChange={date => this.setState({ endTime: date })}
            value={this.state.endTime}
            renderSecondHand={false}
            required
          />
          <RightAlignedButton type="submit">confirm</RightAlignedButton>

          {this.state.isSettingTimeRange && (
            <SpinnerWithInfo info={'Setting Election start and end time...'} />
          )}
        </Form>
      </Fragment>
    );
  }
}

export default SetElectionTimeRange;
