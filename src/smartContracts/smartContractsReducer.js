const initialState = {
  currentBackendContract: null,
  electionTimeRange: null
};

const smartContractsReducer = (state = initialState, action) => {
  if (action.type === 'ELECTION_TIME_RANGE_SET') {
    return Object.assign({}, state, {
      electionTimeRange: action.payload
    });
  }

  return state;
};

export default smartContractsReducer;
