# User stories

## Election administrator

### Sets start and end time of election and adds candidates

The creator and administrator of the election sets the start and end time of the election, then he can add candidates, which have a profile picture, a name, a party and a political program.

### Verifies voters

Until the election has not started, the administrator can receive verification requests by users: only verified voters can vote. A verification request contains an identification document of the user, so that the administrator can check if the requester is effectively who he tells he is.

### Puts Election contract in emergency stop

The administrator can put the Election contract in emergency stop if any bug is discovered. When the fixed contract is deployed he can set its address as the current backend in the Election registry, so the election can restart.

## Election participant

A user who wants to vote can see the candidates for the elections and the results, but in order to vote he must be verified by the election admin.
<br/>
Once he's verified, he can then commit his vote if the election has started or reveal his voted precedently committed if the election ended.
