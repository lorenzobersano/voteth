import { connect } from 'react-redux';
import SetElectionTimeRange from './SetElectionTimeRange';
import { electionTimeRangeSet } from './../../smartContracts/smartContractsActions';

const mapDispatchToProps = dispatch => {
  return {
    electionTimeRangeSet: (startTime, endTime) => {
      dispatch(electionTimeRangeSet(startTime, endTime));
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SetElectionTimeRange);
