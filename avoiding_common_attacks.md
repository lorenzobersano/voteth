# Avoiding common attacks

Since the Election and the ElectionsList contracts are very straightforward with no external calls, I didn't take any particular measure to avoid common attacks.

I just made a consideration about using the `now` built-in constant in the Election contract: since it's only used to check the state of the election (still not opened, opened, closed), the 30-seconds miner manipulation window is tolerable.
