import React, { Component } from 'react';
import { Link } from 'react-router';
import {
  HiddenOnlyAuth,
  VisibleOnlyAuth,
  VisibleOnlyAuthAdmin
} from '../../util/wrappers.js';
import styled from 'styled-components';

import { checkIfStopped } from './../../util/electionContractInteractions';

// UI Components
import LoginButtonContainer from '../../user/ui/loginbutton/LoginButtonContainer';
import LogoutButtonContainer from '../../user/ui/logoutbutton/LogoutButtonContainer';
import HeaderTitleContainer from '../headerTitle/HeaderTitleContainer.js';

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #0000001e;
  border-bottom: 1px solid #0000001e;

  @media (max-width: 45rem) {
    flex-direction: column;
    padding-bottom: 1rem;
  }
`;

const Links = styled.div`
  display: flex;

  @media (max-width: 720px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
`;

const NavLink = styled(Link)`
  padding-right: 0.5rem;
  color: #555;
  height: 100%;

  :hover,
  :active {
    color: black;
  }

  @media (max-width: 768px) {
    padding-bottom: 0.5rem;
    justify-content: center;
  }
`;

export default class Header extends Component {
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

      !this.isCancelled &&
        ((!this.state.emergencyStop && emergencyStop) ||
          (this.state.emergencyStop && !emergencyStop)) &&
        this.setState({ emergencyStop });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    if (!this.props.mainPage) {
      this.checkIfContractIsInEmergencyStop();

      setInterval(() => {
        this.checkIfContractIsInEmergencyStop();
      }, 2000);
    }
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() => [
      this.state.emergencyStop ? (
        <a
          key={'emergencyStop'}
          style={{ color: 'red', paddingRight: '0.5rem' }}
        >
          Emergency stop!
        </a>
      ) : (
        [
          <NavLink to="/profile" key={'profile'}>
            Profile
          </NavLink>,
          <NavLink to="/requestVerification" key={'requestVerification'}>
            Request verification
          </NavLink>
        ]
      ),
      <LogoutButtonContainer key={'logout'} />
    ]);

    const OnlyAuthAdminLinks = VisibleOnlyAuthAdmin(() => [
      <NavLink to="/handleEmergency" key={'handleEmergency'}>
        Handle emergency
      </NavLink>,
      <NavLink to="/addCandidate" key={'addCandidate'}>
        Add candidate
      </NavLink>,
      <NavLink to="/setElectionTimeRange" key={'setElectionTimeRange'}>
        Set election time range
      </NavLink>,
      <NavLink to="/verifyVoters" key={'verifyVoters'}>
        Verify voters
      </NavLink>,
      <LogoutButtonContainer key={'logout'} />
    ]);

    const OnlyGuestLinks = HiddenOnlyAuth(() => <LoginButtonContainer />);

    return (
      <Navbar>
        <HeaderTitleContainer />
        {!this.props.mainPage ? (
          <Links>
            {!this.state.emergencyStop && [
              <NavLink to="/electionHome" key={'electionHome'}>
                Candidates
              </NavLink>,
              <NavLink to="/results" key={'results'}>
                Results
              </NavLink>
            ]}
            <OnlyGuestLinks />
            <OnlyAuthAdminLinks />
            <OnlyAuthLinks />
          </Links>
        ) : (
          <Links>
            <NavLink to="/createElection">Create election</NavLink>
          </Links>
        )}
      </Navbar>
    );
  }
}
