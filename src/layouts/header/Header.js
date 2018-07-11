import React, { Component } from 'react';
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
import Container from '../container/Container';

const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #0000001e;
`;

const HeaderTitle = styled.h1`
  font-size: 3rem;
  color: #02111b;
`;

const LoggedInLinksContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

export default class Header extends Component {
  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() => (
      <LoggedInLinksContainer>
        <Link to="/dashboard">Dashboard</Link> |
        <Link to="/profile">Profile</Link> |
        <Link to="/requestVerification">Request verification</Link> |
        <LogoutButtonContainer />
      </LoggedInLinksContainer>
    ));

    const OnlyAuthAdminLinks = VisibleOnlyAuthAdmin(() => (
      <LoggedInLinksContainer>
        <Link to="/addCandidate">Add candidate</Link> |
        <Link to="/setElectionTimeRange">Set election time range</Link> |
        <Link to="/verifyVoters">Verify voters</Link> |
        <LogoutButtonContainer />
      </LoggedInLinksContainer>
    ));

    const OnlyGuestLinks = HiddenOnlyAuth(() => <LoginButtonContainer />);

    return (
      <Container>
        <Navbar>
          <Link to="/">
            <HeaderTitle>votΞ</HeaderTitle>
          </Link>
          <OnlyGuestLinks />
          <OnlyAuthAdminLinks />
          <OnlyAuthLinks />
        </Navbar>
      </Container>
    );
  }
}
