pragma solidity ^0.4.24;

/** @title Election: keeps the state of an election and of the verified voters */
contract Election {
    uint startTime;
    uint endTime;
    address owner;
    
    modifier onlyVerifiedVoter {
        require(verifiedVoter[msg.sender].verified == true);
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
    
    modifier voterHasNotVoted {
        require(voterHasVoted[msg.sender] == false);
        _;
    }
    
    event VerificationRequestDeleted(uint _position);
    event CandidateDeleted(uint _position);
    
    struct Candidate {
        string imageHash;
        string  name;
        string  party;
        string  politicalProgram;
    }
    
    struct VerificationRequest {
        address requester;
        string votingDocumentIPFSHash;
    }
    
    struct Verification {
        bool verified;
        uint expirationDate;
    }
    
    mapping (address => bool)           voterHasVoted;
    mapping (address => Verification)   verifiedVoter;
    mapping (string => uint)           votes;
    
    VerificationRequest[]   verificationRequests;
    Candidate[]             candidates;

    // constructor (uint _startTime, uint _endTime) public {
    //     owner = msg.sender;
    //     startTime = _startTime;
    //     endTime = _endTime;
    // }

    constructor () public {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner; 
    }
    
    function setElectionTimeRange(uint _startTime, uint _endTime) public onlyOwner {
        startTime = _startTime;
        endTime = _endTime;
    }

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
        for (uint i = _position; i < candidates.length - 1; i++){
            candidates[i] = candidates[i + 1];
        }
    
        candidates.length--;
        emit CandidateDeleted(_position);
    }

    /** @dev                Gets the count of the votes for a certain Candidate
     *  @param  _candidate  The Candidate (expressed as a keccak256 hash of the name and the party) to count the votes for
     *  @return _votes      The number of votes for the Candidate
     */
    function getVotesForCandidate(string _candidate) public view electionIsClosed returns(uint _votes) {
        return votes[_candidate];
    }
    
    /** @dev                Casts a vote for a certain Candidate (expressed as a keccak256 hash of the name and the party)
     *  @param  _vote       The Candidate (expressed as a keccak256 hash of the name and the party) that gets the vote of the sender of the tx
     */
    function vote(string _vote) public onlyVerifiedVoter electionIsOpen voterHasNotVoted {
        votes[_vote]++;
        voterHasVoted[msg.sender] = true;
    }
    
    /** @dev                            For Election users only, creates a VerificationRequest to be able to vote              
     *  @param  _votingDocumentIPFSHash The hash of the document needed to verify the user stored on IPFS
     */
    function requestVerification(string _votingDocumentIPFSHash) public electionIsNotOpenedYet {
        verificationRequests.push(VerificationRequest(msg.sender, _votingDocumentIPFSHash));
    }
    
    /** @dev                            Gets the VerificationRequest from the list of verification requests at a specified index
     *  @param  _position               Position in the list of verification requests
     *  @return _requester              The address of the user who created the request
     *  @return _votingDocumentIPFSHash The hash of the document needed to verify the user stored on IPFS
     */
    function getVerificationRequestAt(uint _position) public view onlyOwner electionIsNotOpenedYet returns(address _requester, string _votingDocumentIPFSHash) {
        return (
            verificationRequests[_position].requester,
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
     */
    function removeVerificationRequestAt(uint _position) public onlyOwner {
        for (uint i = _position; i < verificationRequests.length - 1; i++){
            verificationRequests[i] = verificationRequests[i+1];
        }
    
        verificationRequests.length--;
        emit VerificationRequestDeleted(_position);
    }
    
    /** @dev                        Checks if the msg.sender has been verified
     *  @return _verificationState  The state of the verification process
     */
    function getVerificationState() public view returns (bool _verificationState) {
        return verifiedVoter[msg.sender].verified;
    } 
    
    /** @dev                    Verifies a voter with a specified address
     *  @param  _voter          The address of the voter to be verified
     *  @param  _expirationDate The expiration date of the document given by user
     */
    function verifyVoter(address _voter, uint _expirationDate) public onlyOwner electionIsNotOpenedYet {
        require(_expirationDate > endTime);
        verifiedVoter[_voter].verified = true;
        verifiedVoter[_voter].expirationDate = _expirationDate;
    }
}