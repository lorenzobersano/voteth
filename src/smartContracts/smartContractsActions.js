export const ELECTION_TIME_RANGE_SET = 'ELECTION_TIME_RANGE_SET';
export const BACKEND_CONTRACT_CHANGED = 'BACKEND_CONTRACT_CHANGED';

export function electionTimeRangeSet(electionStartTime, electionEndTime) {
  return {
    type: ELECTION_TIME_RANGE_SET,
    payload: { electionStartTime, electionEndTime }
  };
}

export function backendContractChanged(backendContract) {
  return {
    type: BACKEND_CONTRACT_CHANGED,
    backendContract
  };
}
