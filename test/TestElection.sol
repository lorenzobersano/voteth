pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Election.sol";

contract TestElection {
  function testItSetsElectionTimeRange() public {
    Election election = Election(DeployedAddresses.Election());

    election.setElectionTimeRange(89, 90);

    (uint expectedStartTime, uint expectedEndTime) = (89, 90);
    (uint effectiveStartTime, uint effectiveEndTime) = election.getElectionTimeRange();

    Assert.equal(effectiveStartTime, expectedStartTime, "It should correctly set the Election start time.");
    Assert.equal(effectiveEndTime, expectedEndTime, "It should correctly set the Election end time.");
  }

  // function testItAddsCandidate() public {
  //   Election election = Election(DeployedAddresses.Election());

  //   string memory testIPFSHash = 'testIPFSHash';
  //   string memory testCandidateName = 'testCandidate';
  //   string memory testCandidateParty = 'testParty';
  //   string memory testCandidatePoliticalProgram = 'testCandidatePoliticalProgram';

  //   election.addCandidate(testIPFSHash, testCandidateName, testCandidateParty, testCandidatePoliticalProgram);

  //   (string memory effectiveIPFSHash, string memory effectiveCandidateName, string memory effectiveCandidateParty, string memory effectiveCandidatePoliticalProgram) = election.getCandidateAt(0);

  //   Assert.equal(effectiveIPFSHash, testIPFSHash, "It should correctly set the candidate pic hash.");
  //   Assert.equal(effectiveCandidateName, testCandidateName, "It should correctly set the candidate name.");
  //   Assert.equal(effectiveCandidateParty, testCandidateParty, "It should correctly set the candidate party.");
  //   Assert.equal(effectiveCandidatePoliticalProgram, testCandidatePoliticalProgram, "It should correctly set the candidate political program.");
  // }
}
