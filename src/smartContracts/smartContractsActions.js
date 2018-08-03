export const ELECTION_TIME_RANGE_SET = 'ELECTION_TIME_RANGE_SET';

export function electionTimeRangeSet(electionStartTime, electionEndTime) {
  return {
    type: ELECTION_TIME_RANGE_SET,
    payload: { electionStartTime, electionEndTime }
  };
}
