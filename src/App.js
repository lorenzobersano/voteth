import React, { Component } from 'react';
import { Fragment } from 'react';

// UI Components
import Header from './layouts/header/Header';

// Styles
import './css/oswald.css';
import './css/open-sans.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Header />
        {this.props.children}
      </Fragment>
    );
  }
}

export default App;
