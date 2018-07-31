import React, { Component } from 'react';
import styled from 'styled-components';

// UI Components
const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgb(250, 250, 250);
  border: 1px solid #0000001e;
  padding: 1rem;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const Candidate = styled.div`
  display: flex;
  align-items: center;
`;

const Infos = styled.div`
  margin-left: 1rem;
`;

const Votes = styled.h2``;

const Name = styled.h2`
  margin: 0;
  font-size: 24px;
`;

const Party = styled.h4`
  margin: 0;
  font-size: 14px;
  color: gray;
`;

export default class Result extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card>
        <Candidate>
          <Avatar src={this.props.candidatePic} alt="Candidate photo" />
          <Infos>
            <Name>{this.props.candidateName}</Name>
            <Party>{this.props.candidateParty}</Party>
          </Infos>
        </Candidate>
        <Votes>{this.props.votes}</Votes>
      </Card>
    );
  }
}
