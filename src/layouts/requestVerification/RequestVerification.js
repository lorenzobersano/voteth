import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert2';
import { MNID } from 'uport-connect';

// Local utils
import {
  requestVerification,
  getVerificationState,
  checkIfUserHasRequestedVerification
} from './../../util/electionContractInteractions';
import { uploadToIPFS } from './../../util/ipfsUtils';
import { SpinnerWithInfo } from './../Spinner';

// UI Components
import RightAlignedButton from './../rightAlignedButton/RightAlignedButton';

const mapStateToProps = state => {
  return {
    electionStartTime: state.smartContracts.electionTimeRange.electionStartTime
  };
};

class RequestVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      userIsVerified: false,
      electionHasAlreadyStarted: false,
      isUploadingOnIpfs: false,
      userHasAlreadyAskedForVerification: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handlePicUpload = this.handlePicUpload.bind(this);
  }

  isCancelled = false;

  async componentDidMount() {
    try {
      const userIsVerified = await getVerificationState(
        MNID.decode(this.props.authData.address).address
      );

      const userHasAlreadyAskedForVerification = await checkIfUserHasRequestedVerification(
        MNID.decode(this.props.authData.address).address
      );

      !this.isCancelled &&
        this.setState({ userHasAlreadyAskedForVerification });

      // Checks if election has already started
      parseInt((new Date().getTime() / 1000).toFixed(0)) >=
        this.props.electionStartTime &&
        this.props.electionStartTime !== 0 &&
        !this.isCancelled &&
        this.setState({ electionHasAlreadyStarted: true });

      !this.isCancelled && this.setState({ userIsVerified });
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  verificationState() {
    if (this.state.userIsVerified) return <p>You're already verified!</p>;
    if (this.state.electionHasAlreadyStarted)
      return (
        <p>
          Election has already started, you cannot ask for verification now.
        </p>
      );
    if (this.state.userHasAlreadyAskedVorVerification)
      return <p>You have already asked for verification.</p>;
  }

  async handleClick(e) {
    e.preventDefault();

    if (!this.state.image) swal('Select an image to submit!', '', 'warning');
    else {
      try {
        !this.isCancelled && this.setState({ isUploadingOnIpfs: true });

        const picHash = await uploadToIPFS(this.state.image);

        !this.isCancelled && this.setState({ isUploadingOnIpfs: false });

        swal({
          type: 'info',
          title: 'Please open the uPort app on your smartphone',
          text: 'Confirm the transaction to request for verification'
        });

        await requestVerification(
          this.props.authData.name,
          this.props.authData.avatar.uri,
          picHash,
          this.props.authData.address
        );

        swal('Verification request sent correctly!', '', 'success');
      } catch (error) {
        swal(error, '', 'error');
      }
    }
  }

  handlePicUpload() {
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsArrayBuffer(file);
      reader.onloadend = async () => {
        const buffer = await Buffer.from(reader.result);
        this.setState({ image: buffer });
      };
    }
  }

  render() {
    return (
      <Fragment>
        <h2>Request verification</h2>
        {!this.state.userIsVerified &&
        !this.state.electionHasAlreadyStarted &&
        !this.state.userHasAlreadyAskedForVerification ? (
          <Fragment>
            <p>Upload a photo of your ID Document to get the ability to vote</p>
            <input
              type="file"
              name="pic"
              onChange={this.handlePicUpload}
              required
            />
            <RightAlignedButton onClick={this.handleClick}>
              Upload
            </RightAlignedButton>
          </Fragment>
        ) : (
          this.verificationState()
        )}

        {this.state.isUploadingOnIpfs && (
          <SpinnerWithInfo info={'Uploading ID Document on IPFS...'} />
        )}
      </Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(RequestVerification);
