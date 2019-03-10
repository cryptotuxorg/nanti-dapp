let dapp = {}
let user = {}

window.jdenticon_config = {
  hues: [207],
  lightness: {
      color: [0.84, 0.84],
      grayscale: [0.84, 0.84]
  },
  saturation: {
      color: 0.48,
      grayscale: 0.48
  },
  backColor: "#2a4766ff"
};

async function connectMetamask() {
  try {
    const addresses = await ethereum.enable()
    user.address = addresses[0]

    const provider = new ethers.providers.Web3Provider(ethereum)
    let net = await provider.getNetwork()
    let contractAddr;
    if(net.chainId == 1664) {
      contractAddr = privateQuorumAddress
    } else {
      contractAddr = skaleAddress
    }
    user.signer = provider.getSigner(user.address);

	  let bondContract=new ethers.Contract(contractAddr, bondABI, provider)
    let bondContractSigned=bondContract.connect(user.signer)
    user.isOwner = true//await bondContract.isOwner()
    let currentBalances = []
    dapp = { provider, bondContract, bondContractSigned, net,currentBalances}

    console.log("DApp ready: ", dapp)
    console.log("User ready: ", user)

    refreshData()

  } catch(err) {
    console.error(err);
  }
}

function switchMode(){
  user.isOwner = !user.isOwner
  refreshData()
}

function  refreshData() {
  document.getElementById("connection").innerHTML = "Reload"
  document.getElementById("statut").innerHTML = " <span class='badge badge-secondary'> " + user.address +" </span>"
  jdenticon.update("#id-image", user.address)
  document.getElementById("date").innerHTML = `<sub>Timestamp: <span class="badge badge-primary">${new Date().getTime()}</sub>`
  document.getElementById("network-id").innerHTML = `Network: <span class="text-warning">${ dapp.net.chainId}</span> \" ${ dapp.net.name} \ "`




  loadBonds()
  document.getElementById("rest").classList.remove("d-none")
  if(user.isOwner){
    document.getElementById("issuebtn").classList.remove("d-none")
    document.getElementById("user").setAttribute("style","background-color:#E74C3C;padding: 2rem;")
    document.getElementById("usertype").innerHTML = "Company"
  } else {
    document.getElementById("issuebtn").classList.add("d-none")
    document.getElementById("user").setAttribute("style","background-color:darkgray;padding: 2rem;")
    document.getElementById("usertype").innerHTML = "User"
  }
}




async function issueBond(){
  let princ = parseInt(document.getElementById("inprincipal").value)
  let matDate = new Date(document.getElementById("inmaturity").value)
  // let mat = matDate.getDate()
  console.log(matDate)
  let rate = parseInt(document.getElementById("inrate").value)

  await dapp.bondContractSigned.issue(princ,matDate/1000,rate)
  loadBonds()
}

async function loadBonds() {

  let nbBonds = await dapp.bondContract.nbBonds()

  document.getElementById("bonds-list").innerHTML = ""
  for (let i = 0; i < nbBonds; i++) {
    let bond =  await dapp.bondContract.bonds(i)
    console.log(bond)
    if (bond&&(ethers.utils.getAddress(user.address)==ethers.utils.getAddress(bond.owner) ||user.isOwner)){
      let templateBond = ` <div class="card col-sm" style="margin:0.8rem">
        <div class="card-body">
          <h5 class="card-title">Bond n°${i}   <span class="badge badge-secondary""> % ${(parseInt(bond.rate)+240)/100}</span></h5>
          <p class="card-text">Principal $ ${bond.principal}</p>
          <p class="card-text">${new Date(bond.maturity*1000).toDateString()}</p>`
      
      if(!user.isOwner){
        if(bond.counterparty==0) {
          templateBond+= `<button onclick="collateralize(${i})" class="btn btn-primary">Collateralize</button>
          <div class="form-group ">
            <input type="text" class="form-control-plaintext text-primary" id="incounterpart" style="border: solid;" value="0x992152BF1F24f2d3E29f707c660D81c00dd28579">
          </div>
          `
        }else {
          templateBond+=`<span class="badge badge-secondary">${bond.counterparty}</span><br>
          <button onclick="pay(${i},1)" class="btn btn-success">Pay $1</button>
          <button onclick="pay(${i},5)" class="btn btn-success">Pay $5</button>
          <button onclick="pay(${i},100)" class="btn btn-success">Pay $100</button>
          `
        }
      }

      templateBond+=`  </div>   </div>` 
      document.getElementById("bonds-list").insertAdjacentHTML('beforeend', templateBond)    
    }
  }
}

async function collateralize(indice) {
  let counterpart = document.getElementById("incounterpart").value.toString()
  // ethers.utils.getAddress(counterpart)
  await  dapp.bondContractSigned.collateralize(indice,counterpart)
}

async function pay(indice,amount) {
  if (dapp.currentBalances[indice]) {
    dapp.currentBalances[indice] += amount
  } else {
    dapp.currentBalances[indice] = amount
  }
  knownDebt = dapp.currentBalances[indice]

  let msg = await dapp.bondContract.makeMessage(indice,knownDebt)
  // var buf = Buffer.from(msg, 'utf8');
  // let msgarray = ethers.utils.arrayify(buf)
  let signature = await user.signer.signMessage(msg);
  document.getElementById("msg").innerHTML = `<p>Indice : ${indice}, Amount : ${knownDebt}</p>
  <h5>Message:</h5> 
  <div class="border border-success p-3"> ${msg}</div>
  <br>
  <h5>Signature: </h5> <div class="border border-success p-3">${signature}<div>`
  $('#payModal').modal({
    keyboard: false
  })

}