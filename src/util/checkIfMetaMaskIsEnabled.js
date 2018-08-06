import React, { Component } from 'react';

import MetaMaskFox from '../layouts/MetaMaskFox';

export default WrappedComponent => {
  return class MetaMaskHOC extends Component {
    constructor(props) {
      super(props);

      this.state = {
        metamaskEnabled: true
      };
    }

    isCancelled = false;

    checkIfMetaMaskIsUnlocked() {
      window.web3.eth.accounts.length === 0
        ? !this.isCancelled &&
          this.state.metamaskEnabled &&
          this.setState({ metamaskEnabled: false })
        : !this.isCancelled &&
          !this.state.metamaskEnabled &&
          this.setState({ metamaskEnabled: true });
    }

    componentDidMount() {
      this.checkIfMetaMaskIsUnlocked();

      setInterval(() => {
        this.checkIfMetaMaskIsUnlocked();
      }, 1000);
    }

    componentWillUnmount() {
      this.isCancelled = true;
    }

    render() {
      return this.state.metamaskEnabled ? (
        <WrappedComponent {...this.props} />
      ) : (
        <MetaMaskFox />
      );
    }
  };
};
