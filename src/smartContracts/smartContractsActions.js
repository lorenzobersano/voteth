export const ELECTION_TIME_RANGE_SET = 'ELECTION_TIME_RANGE_SET';
export const CURRENT_ELECTION_CONTRACT_CHANGED =
  'CURRENT_ELECTION_CONTRACT_CHANGED';

export function electionTimeRangeSet(electionStartTime, electionEndTime) {
  return {
    type: ELECTION_TIME_RANGE_SET,
    payload: { electionStartTime, electionEndTime }
  };
}

export function currentElectionContractChanged(electionContract) {
  return {
    type: CURRENT_ELECTION_CONTRACT_CHANGED,
    payload: electionContract
  };
}
