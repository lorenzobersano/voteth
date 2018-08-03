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

const mapStateToProps = state => {
  return {
    electionTimeRange: state.smartContracts.electionTimeRange
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetElectionTimeRange);
