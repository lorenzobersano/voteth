import React, { Component } from 'react';

// UI Components
import Container from '../container/Container';

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props);
    authData = this.props;
  }

  render() {
    return (
      <main>
        <Container>
          <h1>Dashboard</h1>
          <p>
            <strong>Congratulations {this.props.authData.name}!</strong> If
            you're seeing this page, you've logged in with UPort successfully.
          </p>
        </Container>
      </main>
    );
  }
}

export default Dashboard;
