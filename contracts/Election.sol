pragma solidity ^0.4.24;

import "./strings.sol";

/** @title Election: keeps the state of an election and of the verified voters */
contract Election {
    using strings for *;
    
    uint    public startTime;
    uint    public endTime;
    address public owner;
    bool    public stopped;

    modifier stopInEmergency { require(!stopped); _; }

    modifier onlyVerifiedVoter {
        require(verifiedVoter[msg.sender] == true);
        _;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    modifier electionIsNotOpenedYet {
        require(now < startTime);
        _;
    }
    
    modifier electionIsOpen {
        require(now >= startTime && now < endTime);
        _;
    }
    
    modifier electionIsClosed {
        require(now > endTime);
        _;
    }
    
    modifier voterHasNotCommittedVote {
        require(voterHasCommittedVote[msg.sender] == false);
        _;
    }

    modifier voterHasNotRevealedVote {
        require(voterHasRevealedVote[msg.sender] == false);
        _;
    }

    event TimeRangeSet(address _owner);
    event VoteCommitted(address _voter, bytes32 _hashedVote);
    event VoteRevealed(address _voter, string _vote, uint _votesForCandidate);
    event VerificationRequested(address _requester);
    event VerificationRequestRemoved(uint _pos);
    event CandidateAdded(string _name, string _party, string _politicalProgram);
    event CandidateRemoved(uint _pos);
    event CircuitBreakerToggled(bool _status);
    
    struct Candidate {
        string imageHash;
        string name;
        string party;
        string politicalProgram;
    }
    
    struct VerificationRequest {
        address requester;
        string  requesterName;
        string  votingDocumentIPFSHash;
    }
    
    mapping (address => bool)       public  voterHasCommittedVote;
    mapping (address => bool)       public  voterHasRevealedVote;
    mapping (address => bool)       public  verifiedVoter;
    mapping (string => uint)                revealedVotes;
    mapping (address => bytes32)    public  committedVotes;
    
    VerificationRequest[]   verificationRequests;   
    Candidate[]             candidates;

    constructor () public {
        owner = msg.sender;
    }
    
    /** @dev                Sets the time range of the election
     *  @return _startTime  The timestamp of the start time of the election
     *  @return _endTime    The timestamp of the end time of the election
     */
    function setElectionTimeRange(uint _startTime, uint _endTime) public onlyOwner {
        startTime = _startTime;
        endTime = _endTime;

        emit TimeRangeSet(msg.sender);
    }

    /** @dev                Gets the time range of the election
     *  @return _startTime  The timestamp of the start time of the election
     *  @return _endTime    The timestamp of the end time of the election
     */
    function getElectionTimeRange() public view returns(uint _startTime, uint _endTime) {
        return (startTime, endTime);
    }
    
    /** @dev                        Adds a Candidate to the list of candidates
     *  @param _name                Name of the Candidate
     *  @param _party               Party of the Candidate
     *  @param _politicalProgram    The program of the Candidate
     */
    function addCandidate(string _imageHash, string _name, string _party, string _politicalProgram) public onlyOwner electionIsNotOpenedYet {
        candidates.push(Candidate(_imageHash, _name, _party, _politicalProgram));

        emit CandidateAdded(_name, _party, _politicalProgram);
    }
    
    /** @dev                        Gets the Candidate from the list of candidates at a specified index
     *  @param  _position           Position in the list of candidates
     *  @return _name               Name of the Candidate
     *  @return _party              Party of the Candidate
     *  @return _politicalProgram   The program of the Candidate
     */
    function getCandidateAt(uint _position) public view returns(string _imageHash, string _name, string _party, string _politicalProgram) {
        return (
            candidates[_position].imageHash,
            candidates[_position].name,
            candidates[_position].party,
            candidates[_position].politicalProgram
        );
    }

    /** @dev                        Gets the length of the list of candidates
     *  @return _numOfCandidates    The length of the list of candidates
     */
    function getNumberOfCandidates() public view returns(uint _numOfCandidates) {
        return candidates.length;
    }
    
    /** @dev                Removes the Candidate from the list of candidates at a specified index
     *  @param  _position   Position in the list of candidates
     */
    function removeCandidateAt(uint _position) public onlyOwner electionIsNotOpenedYet {
        for (uint i = _position; i < candidates.length - 1; i++) {
            candidates[i] = candidates[i + 1];
        }
    
        candidates.length--;

        emit CandidateRemoved(_position);
    }

    /** @dev                Gets the count of the votes for a certain Candidate
     *  @param  _candidate  The Candidate name to count the votes for
     *  @return _votes      The number of votes for the Candidate
     */
    function getVotesForCandidate(string _candidate) public view electionIsClosed returns (uint _votes) {
        return revealedVotes[_candidate];
    }
    
    /** @dev          Commits a vote for a certain Candidate
     *  @param  _vote The keccak256 hash of the vote in this form: nameOfCandidate-MNIDofVoter-secretPassword
     */
    function commitVote(bytes32 _vote) public onlyVerifiedVoter electionIsOpen voterHasNotCommittedVote stopInEmergency {
        committedVotes[msg.sender] = _vote;
        voterHasCommittedVote[msg.sender] = true;

        emit VoteCommitted(msg.sender, _vote);
    }

    /** @dev                    Reveals the vote previously committed
     *  @param  _vote           The vote in this form: nameOfCandidate-MNIDofVoter-secretPassword in plain text
     *  @param  _committedVote  The keccak256 hash of the vote in this form: nameOfCandidate-MNIDofVoter-secretPassword
     */
    function revealVote(string _vote, bytes32 _committedVote) public onlyVerifiedVoter electionIsClosed voterHasNotRevealedVote stopInEmergency {
        require(committedVotes[msg.sender] == _committedVote);
        require(keccak256(abi.encodePacked(_vote)) == _committedVote);

        // Using the stringutils library, gets only the nameOfCandidate part of the vote
        string memory _votedCandidateName = _vote.toSlice().split("-".toSlice()).toString();
        revealedVotes[_votedCandidateName]++;
        voterHasRevealedVote[msg.sender] = true;

        emit VoteRevealed(msg.sender, _votedCandidateName, revealedVotes[_votedCandidateName]);
    }
    
    /** @dev                            For Election users only, creates a VerificationRequest to be able to vote             
     *  @param  _requesterName          The name fo the requester
     *  @param  _votingDocumentIPFSHash The hash of the document needed to verify the user stored on IPFS
     */
    function requestVerification(string _requesterName, string _votingDocumentIPFSHash) public electionIsNotOpenedYet stopInEmergency {
        verificationRequests.push(VerificationRequest(msg.sender, _requesterName, _votingDocumentIPFSHash));

        emit VerificationRequested(msg.sender);
    }
    
    /** @dev                            Gets the VerificationRequest from the list of verification requests at a specified index
     *  @param  _position               Position in the list of verification requests
     *  @return _requester              The address of the user who created the request
     *  @return _requesterName          The name of the user who created the request
     *  @return _votingDocumentIPFSHash The hash of the document needed to verify the user stored on IPFS
     */
    function getVerificationRequestAt(uint _position) public view electionIsNotOpenedYet returns (address _requester, string _requesterName, string _votingDocumentIPFSHash) {
        return (
            verificationRequests[_position].requester,
            verificationRequests[_position].requesterName,
            verificationRequests[_position].votingDocumentIPFSHash
        );
    }

    /** @dev                        Gets the length of the list of candidates
     *  @return _numOfCandidates    The length of the list of candidates
     */
    function getNumberOfVerificationRequests() public view returns(uint _numOfVerificationRequests) {
        return verificationRequests.length;
    }
    
    /** @dev              Removes the VerificationRequest from the list of verification requests at a specified index
     *  @param  _position Position in the list of verification requests
     *  @return _result   Always true
     */
    function removeVerificationRequestAt(uint _position) public onlyOwner {
        for (uint i = _position; i < verificationRequests.length - 1; i++) {
            verificationRequests[i] = verificationRequests[i + 1];
        }
    
        verificationRequests.length--;

        emit VerificationRequestRemoved(_position);
    }
    
    /** @dev                    Verifies a voter with a specified address
     *  @param  _voter          The address of the voter to be verified
     */
    function verifyVoter(address _voter, uint _pos) public onlyOwner electionIsNotOpenedYet {
        verifiedVoter[_voter] = true;
        removeVerificationRequestAt(_pos);
    }

    /** @dev    Lets the admin lock or unlock certain functionalities in certain situations (circuit breaker pattern)
     */
    function toggleCircuitBreaker() onlyOwner public {
        stopped = !stopped;

        emit CircuitBreakerToggled(stopped);
    }

    // This is just in case someone accidentally sends Ether to this contract
    function () public payable {
        revert();
    }
}