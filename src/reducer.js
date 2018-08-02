import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userReducer from './user/userReducer';
import smartContractsReducer from './smartContracts/smartContractsReducer';

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  smartContracts: smartContractsReducer
});

export default reducer;
