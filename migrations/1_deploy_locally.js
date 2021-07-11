const TropixETH = artifacts.require("TropixETH");
const TropixNFT = artifacts.require("TropixNFT");
const TropixWalletETH = artifacts.require("TropixWalletETH");
const TropixRouter = artifacts.require("TropixRouter");

const initialURI = 'https://nft.solange.dev/{id}.json';
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


  // tropixWalletETH
  tropixWalletETH = await deployer.deploy(TropixWalletETH, tropixETH.address, {from: admin});
  console.log("\n tropixWalletETH.address", tropixWalletETH.address);

  // Add tropixWalletETH in Burner role
  await tropixETH.grantRole(BURNER_ROLE, tropixWalletETH.address, {from: admin});

  //Treasury   
  response = (await web3.eth.getBalance(treasury)).toString();  //account[6] - balanceOf ETH
  console.log("\n Treasury ETH balance:  ", response);

  walletEthBefore = (await tropixWalletETH.balanceETH()).toString(); 
  //walletEthBefore = (await web3.eth.getBalance(tropixWalletETH.address)).toString(); 
  console.log("wallet ETH balance before: ", walletEthBefore);

  //Deposit ETH on wallet
  let amount;
  amount = web3.utils.toWei('20','ether');
  console.log("Deposit ETH on wallet: ", amount);
  //await tropixWalletETH.depositETH({value: amount, from: treasury});
  await web3.eth.sendTransaction({ from:treasury, to:tropixWalletETH.address, value:amount });

  walletEthAfter = (await tropixWalletETH.balanceETH()).toString(); 
  //walletEthBefore = (await web3.eth.getBalance(tropixWalletETH.address)).toString(); 
  console.log("wallet ETH balance after receive from treasury: ", walletEthAfter);

  console.log("\n\n");
  amount = web3.utils.toWei('1','ether');

  tropSupplyBefore = (await tropixETH.totalSupply()).toString();
  console.log("tropixETH totalSupply before: ", tropSupplyBefore);

  //Mint tropixETH for user be able to swap for ETH
  await tropixETH.mint(user, amount, {from: admin} );

  tropixETHSupply = (await tropixETH.totalSupply()).toString();
  console.log("tropixETH totalSupply after mint for user: ", tropixETHSupply);

  //User tropixETH balance before
  tropBefore = (await tropixETH.balanceOf(user)).toString();
  console.log("User tropixETH balance before: ", tropBefore);

  //User ETH balance before
  ethBefore = (await web3.eth.getBalance(user)).toString();
  console.log("User ETH balance before: ", ethBefore);

  //User approve tropixETH for tropixWalletETH => not necessary because using ForcedBurn
  // console.log("tropixETH - approve for tropixWalletETH");
  // await tropixETH.approve(tropixWalletETH.address, amount, {from: user} );

  // tropixWalletETH swap = withdrawETH
  console.log("tropixWalletETH swap = withdrawETH");
  await tropixWalletETH.withdrawETH(user, amount, {from: user})

  //User tropixETH balance after
  tropAfter = (await tropixETH.balanceOf(user)).toString();
  //User ETH balance after
  ethAfter = (await web3.eth.getBalance(user)).toString();

  //Balances
  console.log("\nUser Balances");
  console.log("ETH Before:\t", ethBefore, "TPX Before:\t", tropBefore);
  console.log("ETH After: \t", ethAfter, "TPX After: \t", tropAfter);

  walletEthAfter = (await tropixWalletETH.balanceETH()).toString(); 
  tropSupplyAfter = (await tropixETH.totalSupply()).toString();

  console.log("\nTropix Balances");
  console.log("ETH Before:\t", walletEthBefore, "\t\t\t TPX TotalSupply Before:\t", tropSupplyBefore);
  console.log("ETH After: \t", walletEthAfter, "\t TPX TotalSupply After: \t", tropSupplyAfter);
  

  // tropixNFT
  tropixNFT = await deployer.deploy(TropixNFT, initialURI, {from: admin});
  console.log("tropixNFT.address", tropixNFT.address);


  // tropixRouter
  tropixRouter = await deployer.deploy(TropixRouter, tropixETH.address, tropixNFT.address, {from: admin});
  console.log("\ntropSplitter.address", tropixRouter.address);

  console.log("tropixRouter: grantRole for MINTER_ROLE in tropixNFT");
  await tropixNFT.grantRole(MINTER_ROLE, tropixRouter.address, {from: admin});
  response = await tropixNFT.hasRole(MINTER_ROLE, tropixRouter.address);
  console.log(operator, " tropixRouter tropixNFT.hasRole MINTER_ROLE", response);

  console.log("tropixRouter: grantRole OPERATOR_ROLE in tropixNFT");
  await tropixNFT.grantRole(OPERATOR_ROLE, tropixRouter.address, {from: admin});
  response = await tropixNFT.hasRole(OPERATOR_ROLE, tropixRouter.address);
  console.log(operator, " tropixRouter tropixNFT.hasRole OPERATOR_ROLE", response);

  // Operator can add other ? NO
  // console.log("\n\nOperator can add other operator2 - NO?");
  // await tropixNFT.grantRole(OPERATOR_ROLE, operator2, {from: operator});  


  //Mint NFT
  var id1 = 12345;
  var amountId1 = 5;
  console.log("\nMint NFT id: ", id1, "- amount: ", amountId1);
  await tropixRouter.mintNFT(seller, id1, amountId1, byteData, {from: seller});
  
  //tropixNFT.balanceOf
  response = (await tropixNFT.balanceOf(seller, id1)).toString(); 
  console.log("seller tropixNFT.balanceOf: ", response);

  //tropixNFT.isApproved
  response = await tropixNFT.isApprovedForAll(seller, tropixRouter.address);
  console.log("tropixRouter is tropixNFT.isApprovedForAll for seller: ", response);

  //Mint same id twice
  var amountId1 = 5;
  console.log("\nMint twice NFT id: ", id1, "- amount: ", amountId1);
  await tropixRouter.mintNFT(seller, id1, amountId1, byteData, {from: seller});  
  response = (await tropixNFT.balanceOf(seller, id1)).toString(); 
  console.log("seller tropixNFT.balanceOf: ", response);


  //Sell - Split payments
  console.log("\n");
  let price;
  var tos = [seller, marketPlace, agent];
  const decimalsPerc = (await tropixRouter.decimalpercent())/100;  
  var shares = [(70*decimalsPerc) , (20*decimalsPerc), (10*decimalsPerc)];
  console.log("tos: ", tos);
  console.log("shares: ", shares);

  //Split payment price: 1 ETH
  //price = web3.utils.toWei('1','ether');

  //price = 1;      // wei
  //price = 9;
  //price = 30;
  //price = 31;
  price = 33;
  //price = 89;  

  //TO DO:
  //price = maxAmount;
  //price = maxAmount + 1;


  //Mint tropixETH for buyer be able to buy and pay
  await tropixETH.mint(buyer, price, {from: admin} );
  balanceOfBuyer = (await tropixETH.balanceOf(buyer)).toString();
  console.log("balanceOf Buyer: ", balanceOfBuyer);

  //buyer: approve tropixRouter to tropixETH.transferFrom buyer
  await tropixETH.approve(tropixRouter.address, price, {from: buyer} );

  //Split payment
  console.log("\n\nSplit payment: ", price);
  transaction = await tropixRouter.split(id1, 1, price, buyer, seller, tos, shares, {from: buyer});
  //console.log("transaction\n", transaction);

  console.log("\nBalances");
  balanceOfSeller = (await tropixETH.balanceOf(seller)).toString();
  balanceOfMarketPlace = (await tropixETH.balanceOf(marketPlace)).toString();
  balanceOfAgent = (await tropixETH.balanceOf(agent)).toString();
  console.log("Seller: \t", balanceOfSeller, "MarketPlace: \t", balanceOfMarketPlace, "Agent: \t", balanceOfAgent); 

  /*
*/


  console.log("\n\n\n");
};