let privateQuorumAddress = "0x7179e4822d71b7843c336bf7c19e12c73ac6d5a0";
let skaleAddress = "0xa0d04136d11402292a0b4640d90cf6932bb85858";
let bondABI =   [
  {
    "constant": false,
    "inputs": [
      {
        "name": "amount",
        "type": "uint256"
      },
      {
        "name": "rate",
        "type": "uint256"
      }
    ],
    "name": "calculateDebt",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "nbBonds",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "isIssuable",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ind",
        "type": "uint256"
      }
    ],
    "name": "acceptClosing",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "ind",
        "type": "uint256"
      },
      {
        "name": "lastAmount",
        "type": "uint256"
      }
    ],
    "name": "makeMessage",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "bonds",
    "outputs": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "principal",
        "type": "uint256"
      },
      {
        "name": "maturity",
        "type": "uint256"
      },
      {
        "name": "rate",
        "type": "uint256"
      },
      {
        "name": "counterparty",
        "type": "address"
      },
      {
        "name": "lastKnownAmount",
        "type": "uint256"
      },
      {
        "name": "endClosingTime",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "isOwner",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ind",
        "type": "uint256"
      },
      {
        "name": "counterpart",
        "type": "address"
      }
    ],
    "name": "collateralize",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ind",
        "type": "uint256"
      },
      {
        "name": "to",
        "type": "address"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "principal",
        "type": "uint256"
      },
      {
        "name": "maturity",
        "type": "uint256"
      },
      {
        "name": "rate",
        "type": "uint256"
      }
    ],
    "name": "issue",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ind",
        "type": "uint256"
      }
    ],
    "name": "redeem",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ind",
        "type": "uint256"
      },
      {
        "name": "lastAmount",
        "type": "uint256"
      },
      {
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "challengeClosing",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ind",
        "type": "uint256"
      },
      {
        "name": "lastAmount",
        "type": "uint256"
      }
    ],
    "name": "closing",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "ind",
        "type": "uint256"
      }
    ],
    "name": "forceBondRelease",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_principal",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_maturity",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_rate",
        "type": "uint256"
      }
    ],
    "name": "Issued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "indice",
        "type": "uint256"
      }
    ],
    "name": "Redeemed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  }
]