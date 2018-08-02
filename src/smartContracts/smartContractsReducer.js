const initialState = {
  currentBackendContract: null,
  electionTimeRange: null
};

const smartContractsReducer = (state = initialState, action) => {
  if (action.type === 'ELECTION_TIME_RANGE_SET') {
    console.log(action);

    return Object.assign({}, state, {
      electionTimeRange: action.payload
    });
  }

  if (action.type === 'BACKEND_CONTRACT_CHANGED') {
    return Object.assign({}, state, {
      currentBackendContract: action.backendContract
    });
  }

  return state;
};

export default smartContractsReducer;
