# Design pattern decisions

## Access Restriction

Since the Election contract is manageable by the administrator of the election only, this pattern was needed to correctly restrict access to some functions of the contract, such as adding candidates and verifying voters.

This pattern was implemented with a simple modifier:

```
modifier onlyOwner {
  require(msg.sender == owner);
  _;
}
```

## State Machine

Since votΞ aims to be a pseudoanonymous voting DApp, a State Machine pattern (more precisely the commit-reveal scheme) is needed.

According to the commit-reveal scheme, there is a committment phase where the voter commits his vote as a hash of the name of the candidate, the voter address and a secret. Here is how this phase is implemented in voteth:

```
function commitVote(bytes32 _vote) public onlyVerifiedVoter electionIsOpen voterHasNotCommittedVote stopInEmergency {
  committedVotes[msg.sender] = _vote;
  voterHasCommittedVote[msg.sender] = true;

  emit VoteCommitted(msg.sender, _vote);
}
```

Once the commit phase is over there's the reveal phase, where the voter submits a transaction to the Election contract which contains the hashed vote as submitted in the commit phase and the vote in plain text.

Here's how this is implemented in voteth:

```
function revealVote(string _vote, bytes32 _committedVote) public onlyVerifiedVoter electionIsClosed voterHasNotRevealedVote stopInEmergency {
  require(committedVotes[msg.sender] == _committedVote);
  require(keccak256(abi.encodePacked(_vote)) == _committedVote);

  string memory _votedCandidateName = _vote.toSlice().split("-".toSlice()).toString();
  revealedVotes[_votedCandidateName]++;
  voterHasRevealedVote[msg.sender] = true;

  emit VoteRevealed(msg.sender, _votedCandidateName, revealedVotes[_votedCandidateName]);
}
```

After a vote is revealed, the count of votes for the voted candidate is incremented.

## Circuit Breaker

In votΞ the Circuit Breaker pattern is used alongside the Registry Contract pattern for upgradability.

When the contract is in emergency stop all voter-side functions (committing and revealing votes, asking for verification) are blocked. When the Election contract is stopped, the election admin can make the needed fixes to the contract and then replace the current backend contract address stored in the Registry with the fixed contract address.

In votΞ the Circuit Breaker pattern is implemented using a simple modifier which is applied to all voter-side functions:

```
modifier stopInEmergency { require(!stopped); _; }
```
