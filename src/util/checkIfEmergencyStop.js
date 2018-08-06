import React, { Component } from 'react';
import swal from 'sweetalert2';

import {
  checkIfStopped,
  getElectionCurrentInstance
} from './electionContractInteractions';

import EmergencyStopWarning from '../layouts/EmergencyStopWarning';

export default WrappedComponent => {
  return class EmergencyStopHOC extends Component {
    constructor(props) {
      super(props);

      this.state = {
        emergencyStop: false
      };
    }

    isCancelled = false;

    async checkIfContractIsInEmergencyStop() {
      try {
        const emergencyStop = await checkIfStopped();

        if (!emergencyStop && this.state.emergencyStop) {
          try {
            await getElectionCurrentInstance();

            !this.isCancelled && this.setState({ emergencyStop: false });

            swal(
              'Election has reopened',
              'Thank you for your patience!',
              'info'
            );
          } catch (error) {
            console.log(error);
          }
        }

        !this.isCancelled &&
          ((!this.state.emergencyStop && emergencyStop) ||
            (this.state.emergencyStop && !emergencyStop)) &&
          this.setState({ emergencyStop });
      } catch (error) {
        console.log(error);
      }
    }

    componentDidMount() {
      this.checkIfContractIsInEmergencyStop();

      setInterval(() => {
        this.checkIfContractIsInEmergencyStop();
      }, 2000);
    }

    componentWillUnmount() {
      this.isCancelled = true;
    }

    render() {
      return !this.state.emergencyStop ? (
        <WrappedComponent {...this.props} />
      ) : (
        <EmergencyStopWarning />
      );
    }
  };
};
