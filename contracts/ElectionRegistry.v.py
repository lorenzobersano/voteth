backendContract: public(address)
previousBackends: address[127000] # temporary solution with ridicolously high size, as Vyper still does not support dynamically-sized arrays
numOfPreviousBackends: int128
owner: public(address)

@public
def __init__():
    self.owner = msg.sender
    self.numOfPreviousBackends = 0

# @dev                   Changes the current Election contract
# @param  _newBackend    The address of the updated contract
# @return                True if _newBackend is different from backendContract, else false
@public
def changeBackend(_newBackend: address) -> bool:
    assert msg.sender == self.owner
    if _newBackend != self.backendContract:
        self.previousBackends[self.numOfPreviousBackends] = self.backendContract
        self.backendContract = _newBackend
        self.numOfPreviousBackends = self.numOfPreviousBackends + 1
        return True
    return False
    
    