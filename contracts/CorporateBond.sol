pragma solidity  >=0.5.0 <0.6.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol ";

contract CorporateBond is Ownable {
  struct Bond {}
  mapping (uint256 => address) private _tokenOwner;

  event Issued(address indexed _operator, address indexed _to, uint256 _value, bytes _data);
  event Redeemed(address indexed _operator, address indexed _from, uint256 _value, bytes _data);

  constructor() public {
  }
  // Approximation of the ERC1594 Security Token Standard Implementation
  // Token Issuance
  function isIssuable() external view returns (bool){
    return true;
  }
  function issue(address _tokenHolder, uint256 _amount uint256 _maturity, uint256 _rate) external{
    emit Issued(_tokenHolder,maturity,rate)
  }



  // Token Redemption
  function redeem(uint256 _value, bytes _data) external{

  }

	EOY payment > pull libor, get it to you
	CurrentMeldnder
	ongoingDebt

	Collateralize(lender)
	payback(bondID) + amount (pay + interestrate)
	Blocklockeds

	calculate intereste(Rate,initblock, finalblock)

}