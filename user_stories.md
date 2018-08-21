# User stories

## Election administrator

### Creates election

Giving a simple name and description to the election, any MetaMask user can create an election and manage it.

### Sets start and end time of election and adds candidates

The creator and administrator of the election sets the start and end time of the election, then he can add candidates, which have a profile picture, a name, a party and a political program.

Normally the election admin shouldn't have the possibility to change the election start and end time once set, but because this is just a demonstration I decided
to make it so in order to test the different phases of the election faster.

### Verifies voters

Until the election has not started, the administrator can receive verification requests by users: only verified voters can vote. A verification request contains an identification document and a photo of the user, so that the administrator can check if the requester is effectively who he tells he is.

### Puts Election contract in emergency stop

The administrator can put the Election contract in emergency stop if any bug or problem is discovered. When the fixed contract is deployed he can set its address as the current backend in the Election registry, so the election can restart.

## Election participant

A user who wants to vote can see the candidates for the elections and the results, but in order to vote he must be verified by the election admin.
<br/>
Once he's verified, he can then commit his vote if the election has started or reveal his voted precedently committed if the election ended.
