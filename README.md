## Getting Started

### Prerequisites

```shell
npm i npm@latest -g
npm init -y
```

### Installation

```shell
npm i -D hardhat
npx hardhat
```

√ What do you want to do? · Create an empty hardhat.config.js
Config file created  

```shell
npm install --save-dev "hardhat@^2.9.9" "@nomiclabs/hardhat-waffle@^2.0.0" "ethereum-waffle@^3.0.0" "chai@^4.2.0" "@nomiclabs/hardhat-ethers@^2.0.0" "ethers@^5.0.0" "@nomiclabs/hardhat-etherscan@^3.0.0" "dotenv@^16.0.0" "eslint@^7.29.0" "eslint-config-prettier@^8.3.0" "eslint-config-standard@^16.0.3" "eslint-plugin-import@^2.23.4" "eslint-plugin-node@^11.1.0" "eslint-plugin-prettier@^3.4.0" "eslint-plugin-promise@^5.1.0" "hardhat-gas-reporter@^1.0.4" "prettier@^2.3.2" "prettier-plugin-solidity@^1.0.0-beta.13" "solhint@^3.3.6" "solidity-coverage@^0.7.16" "@typechain/ethers-v5@^7.0.1" "@typechain/hardhat@^2.3.0" "@typescript-eslint/eslint-plugin@^4.29.1" "@typescript-eslint/parser@^4.29.1" "@types/chai@^4.2.21" "@types/node@^12.0.0" "@types/mocha@^9.0.0" "ts-node@^10.1.0" "typechain@^5.1.2" "typescript@^4.5.2"
```

```shell
npm i -D hardhat-deploy
npm i -D @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
```


## Resources

Lesson 13 of the FreeCodeCamp Solidity & Javascript Blockchain Course
* https://github.com/PatrickAlphaC/hardhat-defi-fcc

Token Wrapped Ether in Rinkeby Net
* https://rinkeby.etherscan.io/token/0xdf032bc4b9dc2782bb09352007d4c57b75160b15
* https://rinkeby.etherscan.io/token/0xdf032bc4b9dc2782bb09352007d4c57b75160b15#writeContract

Token Wrapped Ether in Main Net
* https://etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2

abi-to-sol v0.6.1
* https://gnidan.github.io/abi-to-sol/

Hardhat Mainnet forking
* https://hardhat.org/hardhat-network/guides/mainnet-forking

Alchemy
* https://dashboard.alchemyapi.io/

AAVE LendingPoolAddressesProvider (see Deployed Contracts section)
* https://docs.aave.com/developers/v/2.0/the-core-protocol/addresses-provider
* https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts   
  0xb53c1a33016b2dc2ff3653530bff1848a515c8c5
* https://docs.aave.com/developers/v/2.0/the-core-protocol/addresses-provider/ilendingpooladdressesprovider

AAVE ILendingPool
* https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool/ilendingpool

@aave/protocol-v2
* https://www.npmjs.com/package/@aave/protocol-v2

IERC20.sol
* https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol

# Usage

## Useful commands

```shell
# Delete folder artefacts and clear folder cash
hh clean

# Compile files in ./contracts
hh compile

# Run tests
hh test

# Code coverage for Solidity tests
hh coverage
```

## Result
```shell
# Run script
hh run scripts/aaveBorrow.ts
```
```text
Got 0.02 ETH
Lending pool address: 0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9
✔ Approved!
Depositing...
✔ Deposited!
___________________________________________________
You have 0.02 worth of ETH deposited.
You have 0.0 worth of ETH borrowed.  
You can borrow 0.0165 worth of ETH.  

The DAI / ETH price is 0.000813286613024077
Trying to borrow 19.27364811983687 DAI (95% of available amount)...
✔ You've borrowed!
___________________________________________________
You have 0.02000000002915169 worth of ETH deposited.
You have 0.015674999999999997 worth of ETH borrowed.
You can borrow 0.000825000024050147 worth of ETH.

Trying to repay 19.27364811983687...
✔ Approved!
✔ Repaid!
___________________________________________________
You have 0.020000000049557874 worth of ETH deposited.
You have 0.0000000003989868 worth of ETH borrowed.
You can borrow 0.016499999641898446 worth of ETH.

```
