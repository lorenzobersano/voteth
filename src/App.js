import React from 'react';
import { connect } from 'react-redux';
import { isMNID, decode } from 'mnid';

// UI Components
import Header from './layouts/header/Header';

// Styles
import './css/oswald.css';
import './css/open-sans.css';
import './App.css';
import Container from './layouts/container/Container';

const mapStateToProps = state => {
  return {
    authData: state.user.data
  };
};

const App = props => (
  <Container>
    {props.authData && (
      <p>
        <strong>Current account:</strong>{' '}
        {!isMNID(props.authData.address)
          ? props.authData.address
          : decode(props.authData.address).address}
      </p>
    )}
    <Header />
    {props.children}
  </Container>
);

export default connect(
  mapStateToProps,
  null
)(App);
