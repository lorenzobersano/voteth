import { electionTimeRangeSet } from './smartContracts/smartContractsActions';
import { connect } from 'react-redux';
import App from './App';

const mapStateToProps = state => {
  return {
    authData: state.user.data,
    electionTimeRange: state.smartContracts.electionTimeRange,
    currentElectionContract: state.smartContracts.currentElectionContract
  };
};

const mapDispatchToProps = dispatch => {
  return {
    electionTimeRangeSet: (startTime, endTime) => {
      dispatch(electionTimeRangeSet(startTime, endTime));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
