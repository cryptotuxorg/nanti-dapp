# Nanti 

Nanti is a dapp allowing to issue corporate bonds on an Ethereum compatible network, and to use them as collateral for instant payment channels.

The contract is meant to be deployed by a corporate entity that want to issue and sell bonds. It aims to be compatible with relevant standards (ERC1400 & ss.), allowing issuance and redemption.

Additionnaly the owner of a bond can offer it as a collateral to open a payment channel to a counterparty. This owner can know pay this counterparty with offchain messages. Similarly to adex OUTPACE protocole, outstanding amount can only increase.

At any moment he can attempt to close the channel by paying to the contract this temporary debt. The counterparty has then a time to decide :
- Collect the amount paid and release his claim on the bond
- Contest the amount with a higher proof, and collect amount paid and become owner of the bond

