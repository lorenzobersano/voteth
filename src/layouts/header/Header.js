import React, { Component, Fragment } from 'react';
import { Link } from 'react-router';
import {
  HiddenOnlyAuth,
  VisibleOnlyAuth,
  VisibleOnlyAuthAdmin
} from '../../util/wrappers.js';
import styled from 'styled-components';

// UI Components
import LoginButtonContainer from '../../user/ui/loginbutton/LoginButtonContainer';
import LogoutButtonContainer from '../../user/ui/logoutbutton/LogoutButtonContainer';

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

const NavLink = styled(Link)`
  padding-right: 0.5rem;

  @media (max-width: 768px) {
    padding-bottom: 0.5rem;
    justify-content: center;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 3rem;
  color: #02111b;
`;

const Links = styled.div`
  display: flex;

  @media (max-width: 720px) {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
`;

export default class Header extends Component {
  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() => [
      <NavLink to="/profile" key={'profile'}>
        Profile
      </NavLink>,
      <NavLink to="/requestVerification" key={'requestVerification'}>
        Request verification
      </NavLink>,
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
        <Link to="/">
          <HeaderTitle>votΞ</HeaderTitle>
        </Link>
        <Links>
          <NavLink to="/results">Results</NavLink>
          <OnlyGuestLinks />
          <OnlyAuthAdminLinks />
          <OnlyAuthLinks />
        </Links>
      </Navbar>
    );
  }
}
