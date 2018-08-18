import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { currentElectionContractChanged } from './../../smartContracts/smartContractsActions';

import RightAlignedButton from '../rightAlignedButton/RightAlignedButton';

const mapStateToProps = state => {
  return {
    currentElectionContract: state.smartContracts.currentElectionContract
  };
};

const mapDispatchToProps = dispatch => {
  return {
    currentElectionContractChanged: currentElectionContract => {
      dispatch(currentElectionContractChanged(currentElectionContract));
    }
  };
};

// UI Components
const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(250, 250, 250);
  border: 1px solid #0000001e;
  padding: 1rem;
`;

const ElectionSubject = styled.div``;

const Name = styled.h2`
  margin: 0;
  font-size: 24px;
`;

const Description = styled.h4`
  margin: 0;
  font-size: 14px;
  color: gray;
`;

class Election extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.currentElectionContractChanged(this.props.electionContract);
  }

  render() {
    return (
      <Card>
        <ElectionSubject>
          <Name>{this.props.name}</Name>
          <Description>{this.props.description}</Description>
        </ElectionSubject>
        <RightAlignedButton
          style={{ height: '100%' }}
          variant="outlined"
          onClick={this.handleSubmit}
        >
          Join
        </RightAlignedButton>
      </Card>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Election);
