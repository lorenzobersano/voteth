const Election = artifacts.require('./Election.sol');
const soliditySha3 = require('web3-utils').soliditySha3;

const candidateName = 'Test Candidate',
  candidateParty = 'Test Party',
  candidatePoliticalProgram = 'Test program',
  candidateIPFSHash = 'Test IPFS hash';

let electionInstance;

Election.deployed().then(instance => {
  electionInstance = instance;
});

contract('Election', accounts => {
  it('should set the Election time range', async () => {
    const startTime = 12345678910,
      endTime = 2345678910;

    try {
      await electionInstance.setElectionTimeRange(startTime, endTime, {
        from: accounts[0]
      });

      const electionTimeRange = await electionInstance.getElectionTimeRange();

      assert.equal(
        electionTimeRange[0],
        startTime,
        'The start time of the Election is incorrect.'
      );

      assert.equal(
        electionTimeRange[1],
        endTime,
        'The end time of the Election is incorrect.'
      );
    } catch (error) {
      console.log(error);
    }
  });

  it('should add a Candidate', async () => {
    try {
      await electionInstance.addCandidate(
        candidateIPFSHash,
        candidateName,
        candidateParty,
        candidatePoliticalProgram,
        { from: accounts[0] }
      );

      const candidate = await electionInstance.getCandidateAt(0);

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
    } catch (error) {
      console.log(error);
    }
  });

  it('should create a VerificationRequest', async () => {
    const requesterAddress = accounts[0],
      requesterName = 'Test requester',
      requesterDocumentIPFSHash = 'Test IPFS hash';

    try {
      await electionInstance.requestVerification(
        requesterName,
        requesterDocumentIPFSHash,
        { from: requesterAddress }
      );

      const verificationRequest = await electionInstance.getVerificationRequestAt(
        0
      );

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
    } catch (error) {
      console.log(error);
    }
  });

  it('should verify a voter', async () => {
    try {
      const verificationRequest = await electionInstance.getVerificationRequestAt(
        0
      );

      await electionInstance.verifyVoter(accounts[0], verificationRequest[0], {
        from: accounts[0]
      });

      const verificationState = await electionInstance.verifiedVoter(
        accounts[0]
      );

      assert.equal(
        verificationState,
        true,
        'The requester should have been verified.'
      );
    } catch (error) {
      console.log(error);
    }
  });

  it('should delete a given verification request', async () => {
    const requesterAddress = accounts[1],
      requesterName = 'Test requester 2',
      requesterDocumentIPFSHash = 'Test IPFS hash 2',
      posOfTheVerificationRequestToDelete = 0;

    try {
      await electionInstance.requestVerification(
        requesterName,
        requesterDocumentIPFSHash,
        { from: requesterAddress }
      );

      await electionInstance.removeVerificationRequestAt(
        posOfTheVerificationRequestToDelete,
        { from: accounts[0] }
      );

      const numOfVerificationRequests = await electionInstance.getNumberOfVerificationRequests();

      assert.equal(
        numOfVerificationRequests,
        0,
        'The list of verification requests should be empty.'
      );
    } catch (error) {
      console.log(error);
    }
  });

  it('should commit a vote', async () => {
    const startTime = parseInt((new Date().getTime() / 1000).toFixed(0)) - 10;
    const endTime = parseInt((new Date().getTime() / 1000).toFixed(0)) + 10;

    try {
      await electionInstance.setElectionTimeRange(startTime, endTime, {
        from: accounts[0]
      });

      const voteHash = soliditySha3(
        `'${candidateName}-${accounts[0]}-provaPassword'`
      );

      await electionInstance.commitVote(voteHash, { from: accounts[0] });

      const committedVote = await electionInstance.committedVotes(accounts[0]);

      assert.equal(
        voteHash,
        committedVote,
        'The vote has not been committed correctly.'
      );
    } catch (error) {
      console.log(error);
    }
  });

  it('should reveal a vote', async () => {
    const startTime = parseInt((new Date().getTime() / 1000).toFixed(0)) - 20;
    const endTime = parseInt((new Date().getTime() / 1000).toFixed(0)) - 10;

    try {
      await electionInstance.setElectionTimeRange(startTime, endTime, {
        from: accounts[0]
      });

      const vote = `'${candidateName}-${accounts[0]}-provaPassword'`;
      const voteHash = soliditySha3(vote);

      await electionInstance.revealVote(vote, voteHash, { from: accounts[0] });

      const numOfVotesForVotedCandidate = await electionInstance.getVotesForCandidate(
        `'${candidateName}`
      );

      assert.equal(
        numOfVotesForVotedCandidate.toNumber(),
        1,
        'The vote has not been revealed correctly.'
      );
    } catch (error) {
      console.log(error);
    }
  });
});
