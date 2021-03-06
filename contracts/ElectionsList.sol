pragma solidity ^0.4.24;

/** @title ElectionsList: keeps a list of ElectionRegistry contracts with name and description of election */
contract ElectionsList {

    modifier onlyOwner(uint _pos) {
        require(msg.sender == elections[_pos].creator, "The sender of the tx must be the owner of the election to execute this function");
        _;
    }

    event ElectionDeleted(uint _pos);
    
    struct Election {
        address creator;
        string  name;
        string  description;
        address electionRegistryAddress;
    }

    Election[] public elections;

    /** @dev                    Gets the length of the list of Elections
    *   @return _numOfElections The length of the list of Elections
    */
    function getNumOfElections() public view returns (uint _numOfElections) {
        return elections.length;
    }

    /** @dev                            Adds an Election to the list of elections
    *   @param _name                    Name of the Election
    *   @param _description             Description of the Election
    *   @param _electionRegistryAddress Address of the ElectionRegistry of the Election
    */
    function createElection(string _name, string _description, address _electionRegistryAddress) public {
        elections.push(Election(msg.sender, _name, _description, _electionRegistryAddress));
    }

    /** @dev                 Removes the Election from the list of elections at a specified index
     *  @param  _position    Position in the list of elections
     */
    function removeElectionAt(uint _position) public onlyOwner(_position) {
        for (uint i = _position; i < elections.length - 1; i++) {
            elections[i] = elections[i + 1];
        }

        elections.length--;

        emit ElectionDeleted(_position);
    }

    // This is just in case someone accidentally sends Ether to this contract
    function () public payable {
        revert("Funds sending not authorized");
    }
}