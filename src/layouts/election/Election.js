import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button } from '@material-ui/core';
import swal from 'sweetalert2';

import { currentElectionContractChanged } from './../../smartContracts/smartContractsActions';
import { removeElectionAt } from '../../util/electionsListContractInteractions';

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

const ButtonsContainer = styled.div`
  display: 'flex';
  align-items: 'flex-end';
`;

class Election extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    this.props.currentElectionContractChanged(this.props.electionContract);
  }

  async handleDelete(e) {
    e.preventDefault();

    await removeElectionAt(this.props.index, this.props.owner);

    this.props.delete();

    swal('Ok!', 'Election correctly removed', 'success');
  }

  render() {
    return (
      <Card>
        <ElectionSubject>
          <Name>{this.props.name}</Name>
          <Description>{this.props.description}</Description>
        </ElectionSubject>
        <ButtonsContainer>
          <Button
            style={{ alignSelf: 'center' }}
            variant="outlined"
            onClick={this.handleSubmit}
          >
            Join
          </Button>
          {this.props.owner && (
            <Button
              style={{
                alignSelf: 'center',
                color: 'white',
                backgroundColor: 'red',
                marginLeft: '0.5rem'
              }}
              variant="outlined"
              onClick={this.handleDelete}
            >
              Delete
            </Button>
          )}
        </ButtonsContainer>
      </Card>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Election);
