pragma solidity  >=0.5.0 <0.6.0;
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";

contract LiborData {
  uint256 liborRate;
}

contract CorporateBond is Ownable {
  using ECDSA for bytes32;
  
  struct Bond {
    address payable owner;
    uint principal;
    uint maturity; // block
    uint rate; // basis points over LIBOR
    address payable counterparty; 
    uint lastKnownAmount;
    uint endClosingTime;
  }

  Bond[] public bonds;
  uint nbBonds;
  uint currentLIBOR = 2.4; // default value
  address liborDataContract;

  event Issued( uint _principal,uint _maturity, uint _rate);
  event Redeemed(uint indice);

  constructor(address _liborDataContract) public {
    liborDataContract = _liborDataContract;
  }

  function calculateDebt(uint amount,uint rate) public pure returns (uint){
    return amount* (100+currentLIBOR+rate/100)/100;
  }

  function makeMessage(uint ind,uint lastAmount) public pure returns (bytes32){
    return keccak256(abi.encodePacked(ind,lastAmount));
  }
  // Token Issuance - Approximate Compliance to ERC 1594: Core Security Token Standard
  function isIssuable() external pure returns (bool){
    return true;
  }
  function issue( uint principal, uint maturity, uint rate) external onlyOwner{
    bonds.push(Bond(msg.sender,principal,maturity,rate,address(0),0,0));
    nbBonds +=1;
    emit Issued(principal,maturity,rate);
  }

  // Token Redemption
  function redeem(uint ind) external payable{
    require(msg.sender == bonds[ind].owner || msg.sender==bonds[ind].counterparty );
    require(bonds[ind].maturity < now);
    uint currentDebt = calculateDebt(bonds[ind].principal,bonds[ind].rate);
    require(currentDebt <= msg.value);
    address(bonds[ind].owner).transfer(currentDebt);
    delete bonds[ind];
    emit Redeemed(ind);
  }

  function transfer(uint ind, address payable to) public{
    require(msg.sender== bonds[ind].owner);
    bonds[ind].owner = to;
  }

  function collateralize(uint ind, address payable counterpart)public {
    require(msg.sender==bonds[ind].owner);
    require(bonds[ind].counterparty == address(0));
    bonds[ind].counterparty = counterpart;
    // outstandingCredit[msg.sender][counterpart] += bonds[ind].principal;
  }


  function closing(uint ind, uint lastAmount) public payable {
    Bond storage bond = bonds[ind];
    require(bond.owner == msg.sender);
    require(msg.value>=lastAmount);
    bond.lastKnownAmount = lastAmount;
    bond.endClosingTime = now + 36000;
  }


  // After closing, counterparty must withdraw or chanllenge
  function challengeClosing(uint ind, uint lastAmount, bytes memory signature)  public {
    Bond storage bond = bonds[ind];
    require(bond.counterparty == msg.sender);
    require(lastAmount>bond.lastKnownAmount,"Claim is Useless");
    //Verify signature of message
    bytes32 message = makeMessage(ind,lastAmount);
    address signer = message.toEthSignedMessageHash().recover(signature);
    require(signer == msg.sender);
    // get Money and get bond
    bond.counterparty.transfer(lastAmount);
    bond.owner = bond.counterparty;
    bond.counterparty = address(0);
  }

  function acceptClosing(uint ind)  public {
    Bond storage bond = bonds[ind];
    require(bond.counterparty == msg.sender);
    require(bond.lastKnownAmount>0,"channel is not closing");
    //get money and release bond
    bond.counterparty.transfer(bond.lastKnownAmount);
    bond.counterparty = address(0);
  }

  function forceBondRelease(uint ind) public {
    Bond storage bond = bonds[ind];
    require(bond.owner == msg.sender);
    require(now>bond.endClosingTime);
    bond.counterparty=address(0);
  } 
}