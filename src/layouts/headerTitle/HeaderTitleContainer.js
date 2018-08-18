import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import HeaderTitle from './HeaderTitle';
import { currentElectionContractChanged } from './../../smartContracts/smartContractsActions';

const mapDispatchToProps = dispatch => {
  return {
    resetCurrentElectionContract: event => {
      event.preventDefault();

      dispatch(currentElectionContractChanged(null));

      browserHistory.push('/');
    }
  };
};

export default connect(
  null,
  mapDispatchToProps
)(HeaderTitle);
