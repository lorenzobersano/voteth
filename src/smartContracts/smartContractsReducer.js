const initialState = {
  currentElectionContract: null,
  electionTimeRange: null
};

const smartContractsReducer = (state = initialState, action) => {
  if (action.type === 'ELECTION_TIME_RANGE_SET') {
    return Object.assign({}, state, {
      electionTimeRange: action.payload
    });
  }

  if (action.type === 'CURRENT_ELECTION_CONTRACT_CHANGED') {
    return Object.assign({}, state, {
      currentElectionContract: action.payload
    });
  }

  return state;
};

export default smartContractsReducer;
