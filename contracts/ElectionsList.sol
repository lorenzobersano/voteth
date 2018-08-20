pragma solidity ^0.4.24;

/** @title ElectionsList: keeps a list of ElectionRegistry contracts with name and description of election */
contract ElectionsList {
    struct Election {
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
        elections.push(Election(_name, _description, _electionRegistryAddress));
    }

    // This is just in case someone accidentally sends Ether to this contract
    function () public payable {
        revert("Funds sending not authorized");
    }
}