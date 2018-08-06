import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { UserIsAuthenticated } from './util/wrappers.js';

// Layouts
import AppContainer from './AppContainer';
import Home from './layouts/home/Home';
import Results from './layouts/results/Results';
import Profile from './user/layouts/profile/Profile';
import AddCandidateForm from './layouts/addCandidateForm/AddCandidateForm';
import SetElectionTimeRangeContainer from './layouts/setElectionTimeRange/SetElectionTimeRangeContainer';
import VerifyVoters from './layouts/verifyVoters/VerifyVoters.js';
import RequestVerification from './layouts/requestVerification/RequestVerification.js';
import HandleEmergency from './layouts/handleEmergency/HandleEmergency.js';

// Redux Store
import store from './store';
import checkIfMetaMaskIsEnabled from './util/checkIfMetaMaskIsEnabled.js';
import checkIfEmergencyStop from './util/checkIfEmergencyStop';

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={AppContainer}>
        <IndexRoute component={checkIfEmergencyStop(Home)} />
        <Route path="results" component={Results} />
        <Route
          path="handleEmergency"
          component={checkIfMetaMaskIsEnabled(
            UserIsAuthenticated(HandleEmergency)
          )}
        />
        <Route
          path="addCandidate"
          component={checkIfMetaMaskIsEnabled(
            UserIsAuthenticated(AddCandidateForm)
          )}
        />
        <Route
          path="verifyVoters"
          component={checkIfMetaMaskIsEnabled(
            UserIsAuthenticated(VerifyVoters)
          )}
        />
        <Route
          path="setElectionTimeRange"
          component={checkIfMetaMaskIsEnabled(
            UserIsAuthenticated(SetElectionTimeRangeContainer)
          )}
        />
        <Route
          path="requestVerification"
          component={UserIsAuthenticated(RequestVerification)}
        />
        <Route path="profile" component={UserIsAuthenticated(Profile)} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
