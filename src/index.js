import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { UserIsAuthenticated } from './util/wrappers.js';

// Layouts
import App from './App';
import Home from './layouts/home/Home';
import Results from './layouts/results/Results';
import Profile from './user/layouts/profile/Profile';
import AddCandidateForm from './layouts/addCandidateForm/AddCandidateForm';
import SetElectionTimeRange from './layouts/setElectionTimeRange/SetElectionTimeRange';
import VerifyVoters from './layouts/verifyVoters/VerifyVoters.js';
import RequestVerification from './layouts/requestVerification/RequestVerification.js';

// Redux Store
import store from './store';

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route
          path="addCandidate"
          component={UserIsAuthenticated(AddCandidateForm)}
        />
        <Route
          path="verifyVoters"
          component={UserIsAuthenticated(VerifyVoters)}
        />
        <Route
          path="setElectionTimeRange"
          component={UserIsAuthenticated(SetElectionTimeRange)}
        />
        <Route
          path="requestVerification"
          component={UserIsAuthenticated(RequestVerification)}
        />
        <Route path="results" component={UserIsAuthenticated(Results)} />
        <Route path="profile" component={UserIsAuthenticated(Profile)} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
