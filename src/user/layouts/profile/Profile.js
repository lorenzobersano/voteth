import React, { Component } from 'react';
import styled from 'styled-components';

// UI Components
import Container from '../../../layouts/container/Container';
import { getVerificationState } from '../../../util/electionContractInteractions';
import { decode } from '../../../../node_modules/mnid';

const UserInfoAndVerificationState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  padding: 1rem;
  margin: 2rem auto;
  border-radius: 4px;
  border: 1px solid #0000001e;
  background: rgb(250, 250, 250);
  width: -webkit-max-content;
  width: -moz-max-content;
  width: max-content;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.5rem;
`;

class Profile extends Component {
  constructor(props, { authData }) {
    super(props);

    this.state = {
      userIsVerified: undefined
    };
  }

  isCancelled = false;

  componentDidMount() {
    this.checkIfUserIsVerified();
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  async checkIfUserIsVerified() {
    try {
      const userIsVerified = await getVerificationState(
        decode(this.props.authData.address).address
      );

      !this.isCancelled && this.setState({ userIsVerified });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <UserInfoAndVerificationState>
        <UserInfo>
          <Avatar src={this.props.authData.avatar.uri} alt="Profile pic" />
          <p>
            Hello, <strong>{this.props.authData.name}</strong>
          </p>
        </UserInfo>
        {this.state.userIsVerified ? (
          <p>✅ You're a verified voter, go on and be part of votΞ!</p>
        ) : (
          <p>
            ❌ Looks like you're not allowed to vote yet, go on and ask for
            verification!
          </p>
        )}
      </UserInfoAndVerificationState>
    );
  }
}

export default Profile;
