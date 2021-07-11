const TropixETH = artifacts.require("TropixETH");

const byteData = "0x0";
const MINTER_ROLE = web3.utils.soliditySha3('MINTER_ROLE');
const BURNER_ROLE = web3.utils.soliditySha3('BURNER_ROLE');
const OPERATOR_ROLE = web3.utils.soliditySha3('OPERATOR_ROLE');
console.log("MINTER_ROLE", MINTER_ROLE);
console.log("BURNER_ROLE", BURNER_ROLE);
console.log("OPERATOR_ROLE", OPERATOR_ROLE);


module.exports = async (deployer, network, accounts)=> {

  const [admin, operator, seller, buyer, marketPlace, agent, treasury, user] = accounts;

  // tropixETH
  await deployer.deploy(TropixETH, {from: admin});
  tropixETH = await TropixETH.deployed();
  console.log("\n tropixETH.address", tropixETH.address);

  console.log("\n tropixETH initialSupply");
  const initialSupply = web3.utils.toWei('1000','ether');
  await tropixETH.mint(admin, initialSupply, {from: admin});
  response = (await tropixETH.totalSupply()).toString();
  console.log("tropixETH totalSupply", response);

  let amount;
  amount = web3.utils.toWei('20','ether');
  //Mint tropixETH for user be able to swap for ETH
  await tropixETH.mint(user, amount, {from: admin} );

  //User tropixETH balance before
  tropixETHBalance = (await tropixETH.balanceOf(user)).toString();
  console.log("User tropixETH balance before: ", tropixETHBalance);

  tropixETHSupply = (await tropixETH.totalSupply()).toString();
  console.log("tropixETH totalSupply after mint for user: ", tropixETHSupply);

  // Add operator in Burner role
  await tropixETH.grantRole(BURNER_ROLE, operator, {from: admin});

  console.log("\n tropixETH forcedBurn");
  await tropixETH.forcedBurn(user, amount, {from: operator});
  response = (await tropixETH.totalSupply()).toString();
  console.log("tropixETH totalSupply", response);

  /*
*/


  console.log("\n\n\n");
};