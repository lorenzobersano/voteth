import React, { Component } from 'react';
import styled from 'styled-components';
import { SingleDatePicker } from 'react-dates';

import Label from './../label/Label';
import Container from './../container/Container';

const VerticalLayoutContainer = styled(Container)`
  display: flex;
  flex-direction: column;
`;

class SetElectionTimeRange extends Component {
  constructor() {
    super();
    this.state = {
      startDatePickerFocused: false,
      endDatePickerFocused: false,
      startDate: null,
      endDate: null
    };
  }

  render() {
    return (
      <VerticalLayoutContainer>
        <Label>Start time</Label>
        <SingleDatePicker
          date={this.state.startDate}
          onDateChange={date => this.setState({ startDate: date })}
          focused={this.state.startDatePickerFocused}
          onFocusChange={({ focused }) =>
            this.setState({ startDatePickerFocused: focused })
          }
          id="startDatePicker"
        />
        <Label>End time</Label>
        <SingleDatePicker
          date={this.state.endDate}
          onDateChange={date => this.setState({ endDate: date })}
          focused={this.state.endDatePickerFocused}
          onFocusChange={({ focused }) =>
            this.setState({ endDatePickerFocused: focused })
          }
          id="endDatePicker"
        />
      </VerticalLayoutContainer>
    );
  }
}

export default SetElectionTimeRange;
