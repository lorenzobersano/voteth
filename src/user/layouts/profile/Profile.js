import React, { Component } from 'react';

// UI Components
import Container from '../../../layouts/container/Container';

class Profile extends Component {
  constructor(props, { authData }) {
    super(props);
    authData = this.props;
  }

  render() {
    return (
      <main>
        <Container>
          <h1>Profilo</h1>
          <p>
            <strong>Nome</strong>
            <br />
            {this.props.authData.name}
            <br />
            <img
              src={this.props.authData.avatar.uri}
              alt="Immagine di profilo"
            />
          </p>
        </Container>
      </main>
    );
  }
}

export default Profile;
