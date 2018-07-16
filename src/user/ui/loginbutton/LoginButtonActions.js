import { browserHistory } from 'react-router';
import { uport } from './../../../util/connectors.js';
import { getElectionAdminRights } from './../../../util/electionContractInteractions';
import { decode } from 'mnid';

export const USER_LOGGED_IN = 'USER_LOGGED_IN';

function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  };
}

export function loginUser() {
  return async dispatch => {
    // UPort and its web3 instance are defined in ./../../../util/wrappers.
    // Request uPort persona of account passed via QR
    let owner;
    let credentials;

    // If the current user is logged in with MetaMask and is admin
    try {
      owner = await getElectionAdminRights();

      credentials = {
        name: 'Admin',
        avatar: {
          uri: 'http://linuxdenken.de/wp-content/uploads/2015/06/admin.png'
        },
        address: owner,
        isAdmin: true
      };

      return dispatchAndRedirect();
    } catch (error) {
      console.log(error);
    }

    // Else login with uPort
    try {
      credentials = await uport.requestCredentials({
        requested: ['name', 'avatar'],
        notifications: true
      });

      return dispatchAndRedirect();
    } catch (error) {
      console.log(error);
    }

    function dispatchAndRedirect() {
      dispatch(userLoggedIn(credentials));

      // Used a manual redirect here as opposed to a wrapper.
      // This way, once logged in a user can still access the home page.
      var currentLocation = browserHistory.getCurrentLocation();

      if ('redirect' in currentLocation.query) {
        return browserHistory.push(
          decodeURIComponent(currentLocation.query.redirect)
        );
      }

      return browserHistory.push('/dashboard');
    }
  };
}
