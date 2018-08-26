const Election = artifacts.require('./Election.sol');
const ElectionsList = artifacts.require('./ElectionsList.sol');
const soliditySha3 = require('web3-utils').soliditySha3;
const {
  ipfsHashToBytes32,
  bytes32ToIPFSHash
} = require('./../src/util/ipfsUtils');

const electionName = 'Test name',
  electionDescription = 'Test description',
  candidateName = 'Test Candidate',
  candidateParty = 'Test Party',
  candidatePoliticalProgram = 'Test program',
  candidateIPFSHash = 'QmThrWZhGxEyfpdXKkS4C2mMrGSfL9uHszarBAjty25SQR'; // Test IPFS Hash

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
  const electionOwner = accounts[0];

  it('should create and get an election', async () => {
    try {
      await electionsListInstance.createElection(
        electionName,
        electionDescription,
        electionInstance.address,
        { from: electionOwner }
      );

      const election = await electionsListInstance.elections(0);

      assert.equal(
        election[0],
        electionOwner,
        'The owner of the Election is incorrect.'
      );

      assert.equal(
        election[1],
        electionName,
        'The name of the Election is incorrect.'
      );

      assert.equal(
        election[2],
        electionDescription,
        'The description of the Election is incorrect.'
      );

      assert.equal(
        election[3],
        electionInstance.address,
        'The address of the Election is incorrect.'
      );
    } catch (error) {
      console.log(error);
    }
  });

  it('should not delete an election at a given position if not creator of election', async () => {
    try {
      await electionsListInstance.removeElectionAt(0, { from: accounts[1] });
    } catch (error) {
      const electionNum = await electionsListInstance.getNumOfElections();

      assert.equal(electionNum, 1, 'The election has been deleted.');
    }
  });

  it('should delete an election at a given position if creator of election', async () => {
    try {
      await electionsListInstance.removeElectionAt(0, { from: electionOwner });

      const electionNum = await electionsListInstance.getNumOfElections();

      assert.equal(electionNum, 0, 'The election has not been deleted.');
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
        ipfsHashToBytes32(candidateIPFSHash),
        candidateName,
        candidateParty,
        candidatePoliticalProgram,
        { from: accounts[0] }
      );

      const candidate = await electionInstance.candidates(0);

      assert.equal(
        bytes32ToIPFSHash(candidate[0]),
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
      requesterPicIPFSHash = 'QmZVWoyMPmwLZCZkqS5bXqazBmowtBcDL34ScRUmhs9hHT',
      requesterDocumentIPFSHash =
        'QmZVWoyMPmwLZCZkqS5bXqazBmowtBcDL34ScRUmhs9hHT';

    try {
      await electionInstance.requestVerification(
        requesterName,
        ipfsHashToBytes32(requesterPicIPFSHash),
        ipfsHashToBytes32(requesterDocumentIPFSHash),
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
        bytes32ToIPFSHash(verificationRequest[2]),
        requesterPicIPFSHash,
        'The IPFS hash of the requester pic is incorrect.'
      );

      assert.equal(
        bytes32ToIPFSHash(verificationRequest[3]),
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
      requesterPicIPFSHash = 'QmZVWoyMPmwLZCZkqS5bXqazBmowtBcDL34ScRUmhs9hHT',
      requesterDocumentIPFSHash =
        'QmZVWoyMPmwLZCZkqS5bXqazBmowtBcDL34ScRUmhs9hHT',
      posOfTheVerificationRequestToDelete = 0;

    try {
      await electionInstance.requestVerification(
        requesterName,
        ipfsHashToBytes32(requesterPicIPFSHash),
        ipfsHashToBytes32(requesterDocumentIPFSHash),
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
