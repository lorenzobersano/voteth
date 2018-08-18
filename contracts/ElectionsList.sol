pragma solidity ^0.4.24;

contract ElectionsList {
  struct Election {
    string  name;
    string  description;
    address ethereumAddress;
  }

  Election[] public elections;

  function getNumOfElections() public view returns (uint _numOfElections) {
    return elections.length;
  }

  function createElection(string _name, string _description, address _address) public {
    elections.push(Election(_name, _description, _address));
  }
}