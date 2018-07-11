const Election = artifacts.require('./Election.sol');

contract('Election', accounts => {
  it('should set the Election time range', () => {
    const startTime = 12345678910,
      endTime = 2345678910;

    return Election.deployed()
      .then(instance => {
        electionInstance = instance;

        return electionInstance.setElectionTimeRange(startTime, endTime, {
          from: accounts[0]
        });
      })
      .then(() => {
        return electionInstance.getElectionTimeRange();
      })
      .then(timeRange => {
        assert.equal(
          timeRange[0],
          startTime,
          'The start time of the Election is incorrect.'
        );

        assert.equal(
          timeRange[1],
          endTime,
          'The end time of the Election is incorrect.'
        );
      });
  });

  it('should add a Candidate', () => {
    const candidateName = 'Test Candidate',
      candidateParty = 'Test Party',
      candidatePoliticalProgram = 'Test program',
      candidateIPFSHash = 'Test IPFS hash';

    return Election.deployed()
      .then(instance => {
        electionInstance = instance;

        return electionInstance.addCandidate(
          candidateIPFSHash,
          candidateName,
          candidateParty,
          candidatePoliticalProgram,
          { from: accounts[0] }
        );
      })
      .then(() => {
        return electionInstance.getCandidateAt(0);
      })
      .then(candidate => {
        assert.equal(
          candidate[0],
          candidateIPFSHash,
          'The IPFS hash of the candidate picture is incorrect.'
        );
        assert.equal(
          candidate[1],
          candidateName,
          'The name of the candidate is incorrect.'
        );
        assert.equal(
          candidate[2],
          candidateParty,
          'The party of the candidate picture is incorrect.'
        );
        assert.equal(
          candidate[3],
          candidatePoliticalProgram,
          'The political program of the candidate picture is incorrect.'
        );
      });
  });

  it('should create a VerificationRequest', () => {
    const requesterAddress = accounts[0],
      requesterName = 'Test requester',
      requesterDocumentIPFSHash = 'Test IPFS hash';

    return Election.deployed()
      .then(instance => {
        electionInstance = instance;

        return electionInstance.requestVerification(
          requesterName,
          requesterDocumentIPFSHash,
          { from: requesterAddress }
        );
      })
      .then(() => {
        return electionInstance.getVerificationRequestAt(0);
      })
      .then(verificationRequest => {
        assert.equal(
          verificationRequest[0],
          requesterAddress,
          'The address of the requester is incorrect.'
        );

        assert.equal(
          verificationRequest[1],
          requesterName,
          'The name of the requester is incorrect.'
        );

        assert.equal(
          verificationRequest[2],
          requesterDocumentIPFSHash,
          'The IPFS hash of the requester is incorrect.'
        );
      });
  });

  it('should verify a voter', () => {
    const testExpirationDate = 34567891011;
    return Election.deployed()
      .then(instance => {
        electionInstance = instance;

        return electionInstance.getVerificationRequestAt(0);
      })
      .then(verificationRequest => {
        return electionInstance.verifyVoter(
          verificationRequest[0],
          testExpirationDate,
          { from: accounts[0] }
        );
      })
      .then(() => {
        return electionInstance.getVerificationState({ from: accounts[0] });
      })
      .then(verificationState => {
        assert.equal(
          verificationState,
          true,
          'The requester shoukd have been verified.'
        );
      });
  });

  it('should delete a given verification request', () => {
    const posOfTheVerificationRequestToDelete = 0;

    return Election.deployed()
      .then(instance => {
        electionInstance = instance;

        return electionInstance.removeVerificationRequestAt(
          posOfTheVerificationRequestToDelete
        );
      })
      .then(() => {
        return electionInstance.getNumberOfVerificationRequests();
      })
      .then(numOfVerificationRequests => {
        assert.equal(
          numOfVerificationRequests,
          0,
          'The list of verification requests should be empty.'
        );
      });
  });
});
