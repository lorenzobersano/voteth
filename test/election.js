const Election = artifacts.require('./Election.sol');
const ElectionsList = artifacts.require('./ElectionsList.sol');
const soliditySha3 = require('web3-utils').soliditySha3;

const electionName = 'Test name',
  electionDescription = 'Test description',
  candidateName = 'Test Candidate',
  candidateParty = 'Test Party',
  candidatePoliticalProgram = 'Test program',
  candidateIPFSHash = 'Test IPFS hash';

let electionInstance, electionsListInstance;

Election.deployed()
  .then(instance => {
    electionInstance = instance;

    return ElectionsList.deployed();
  })
  .then(listInstance => {
    electionsListInstance = listInstance;
  });

/*
 *  ElectionsList test inserts directly the Election address, while in the real DApp it inserts the ElectionRegistry address to achieve
 *  upgradability. Here it's not possible as truffle still doesn't support vyper contracts.
 */

contract('ElectionList', accounts => {
  it('should create and get an election', async () => {
    try {
      await electionsListInstance.createElection(
        electionName,
        electionDescription,
        electionInstance.address
      );

      const election = await electionsListInstance.elections(0);

      assert.equal(
        election[0],
        electionName,
        'The name of the Election is incorrect.'
      );

      assert.equal(
        election[1],
        electionDescription,
        'The description of the Election is incorrect.'
      );

      assert.equal(
        election[2],
        electionInstance.address,
        'The address of the Election is incorrect.'
      );
    } catch (error) {
      console.log(error);
    }
  });
});

/* 
 * These tests are made in this way and order so that every single feature of the contract
 * is tested following the normal use flow of the DApp.
 */

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

      const candidate = await electionInstance.candidates(0);

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
      requesterPicIPFSHash = 'Test requester pic',
      requesterDocumentIPFSHash = 'Test IPFS hash';

    try {
      await electionInstance.requestVerification(
        requesterName,
        requesterPicIPFSHash,
        requesterDocumentIPFSHash,
        { from: requesterAddress }
      );

      const verificationRequest = await electionInstance.verificationRequests(
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
        requesterPicIPFSHash,
        'The IPFS hash of the requester pic is incorrect.'
      );

      assert.equal(
        verificationRequest[3],
        requesterDocumentIPFSHash,
        'The IPFS hash of the requester document is incorrect.'
      );
    } catch (error) {
      console.log(error);
    }
  });

  it('should verify a voter', async () => {
    try {
      const verificationRequest = await electionInstance.verificationRequests(
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
      requesterPicIPFSHash = 'Test requester pic 2',
      requesterDocumentIPFSHash = 'Test IPFS hash 2',
      posOfTheVerificationRequestToDelete = 0;

    try {
      await electionInstance.requestVerification(
        requesterName,
        requesterPicIPFSHash,
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

  it('should toggle circuit breaker', async () => {
    try {
      await electionInstance.toggleCircuitBreaker({
        from: accounts[0]
      });

      const stopped = await electionInstance.stopped();

      assert.equal(stopped, true, 'The contract is not stopped.');
    } catch (error) {
      console.log(error);
    }
  });
});
