import React, { Component } from 'react';

// UI Components
import Container from '../../../layouts/container/Container';
import { getVerificationState } from '../../../util/electionContractInteractions';
import { decode } from '../../../../node_modules/mnid';

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
      <Container>
        <h2>Hello, {this.props.authData.name}!</h2>
        <img src={this.props.authData.avatar.uri} alt="Profile pic" />
        {this.state.userIsVerified ? (
          <p>✅ You're a verified voter, go on and be part of votΞ!</p>
        ) : (
          <p>
            ❌ Looks like you're not allowed to vote yet, go on and ask for
            verification!
          </p>
        )}
      </Container>
    );
  }
}

export default Profile;
