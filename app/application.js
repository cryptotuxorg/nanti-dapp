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
	  let bondContract=new ethers.Contract(privateQuorumAddress, bondABI, provider)
    let bondContractSigned=bondContract.connect(provider.getSigner(user.address))
    user.isOwner = await bondContract.isOwner()

    dapp = { provider, bondContract, bondContractSigned}

    console.log("DApp ready: ", dapp)
    console.log("User ready: ", user)

    refreshData()

  } catch(err) {
    console.error(err);
  }
}

function  refreshData() {
  document.getElementById("connection").innerHTML = "Reload"
  document.getElementById("statut").innerHTML = " <span class='badge badge-secondary'> " + user.address +" </span>"
  jdenticon.update("#id-image", user.address)
  document.getElementById("date").innerHTML = `<sub>Timestamp: <span class="badge badge-primary">${new Date().getTime()}</sub>`


  loadBonds()
  document.getElementById("rest").classList.remove("d-none")
  if(user.isOwner){
    document.getElementById("issuebtn").classList.remove("d-none")
    document.getElementById("user").setAttribute("style","background-color:#E74C3C;padding: 2rem;")
    document.getElementById("usertype").innerHTML = "Company"
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
    if (bond){
      let templateBond = ` <div class="card"class="col-sm">
        <div class="card-body">
          <h5 class="card-title">Bond n°${i}   <span class="badge badge-secondary""> % ${(bond.rate+240)/100}</span></h5>
          <p class="card-text">Principal $ ${bond.principal}</p>
          <p class="card-text">${new Date(bond.maturity*1000).toDateString()}</p>
          <button onclick="collateralize(${i})"  ${((bond.counterparty==0)&&(!user.isOwner))?'class="btn btn-primary"':'class="btn btn-secondary" disabled'} ">Collateralize</button>
        </div>   </div>` 
        document.getElementById("bonds-list").insertAdjacentHTML('beforeend', templateBond)    
    }
  }
}

async function collateralize(indice) {
  await  dapp.bondContractSigned.collateralize(indice)
}