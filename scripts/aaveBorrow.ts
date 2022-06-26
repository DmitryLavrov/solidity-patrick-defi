import {AMOUNT, getWeth, WETH_TOKEN_ADDRESS} from './getWeth'
import {ethers, getNamedAccounts} from 'hardhat'
import {IEACAggregatorProxy, IERC20, ILendingPool, ILendingPoolAddressesProvider} from '../typechain'
import {BigNumber, Signer} from 'ethers'
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers'

async function main() {
  await getWeth()
  const {deployer} = await getNamedAccounts()
  const signer: SignerWithAddress = await ethers.getSigner(deployer)
  const lendingPoolContract: ILendingPool = await getLendingPool(signer)
  console.log(`Lending pool address: ${lendingPoolContract.address}`,)

  // Give to lendingPool the approval to pool our weth token from our account
  await approveErc20('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', lendingPoolContract.address, AMOUNT, signer)

  // https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool#deposit
  console.log('Depositing...')
  await lendingPoolContract.deposit(WETH_TOKEN_ADDRESS, AMOUNT, deployer, 0)
  console.log('✔ Deposited!')

  let {totalDebtETH, availableBorrowsETH} = await getBorrowUserData(lendingPoolContract, signer)

  const daiPrice = await getDaiPrice()
  const amountToBorrowsDAI = parseInt(availableBorrowsETH.toString()) * 0.95 * (1 / daiPrice.toNumber())
  //--------------------------
  console.log(`Trying to borrow ${amountToBorrowsDAI} DAI (95% of available amount)...`)
  //--------------------------
  const amountDaiToBorrowsWEI = ethers.utils.parseEther(amountToBorrowsDAI.toString())

  // Google search: "dai token address mainnet"
  // https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f
  const daiTokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  await borrowDAI(daiTokenAddress, lendingPoolContract, amountDaiToBorrowsWEI, signer)
  await getBorrowUserData(lendingPoolContract, signer)

  //--------------------------
  console.log(`Trying to repay ${amountToBorrowsDAI}...`)
  //--------------------------
  await repay(amountDaiToBorrowsWEI,daiTokenAddress, lendingPoolContract, signer)
  await getBorrowUserData(lendingPoolContract, signer)

}


async function getLendingPool(account: Signer) {
  const lendingPoolAddressesProvider: ILendingPoolAddressesProvider = await ethers.getContractAt(
    'ILendingPoolAddressesProvider',
    '0xb53c1a33016b2dc2ff3653530bff1848a515c8c5',
    account)
  const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
  const lendingPoolContract: ILendingPool = await ethers.getContractAt('ILendingPool', lendingPoolAddress, account)

  return lendingPoolContract
}

async function approveErc20(erc20Address: string, spenderAddress: string, amountToSpend: BigNumber, account: SignerWithAddress) {
  // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol
  const erc20Token: IERC20 = await ethers.getContractAt('IERC20', erc20Address, account)
  const tx = await erc20Token.approve(spenderAddress, amountToSpend)
  await tx.wait(1)
  console.log('✔ Approved!')
}

async function getBorrowUserData(lendingPoolContract: ILendingPool, account: SignerWithAddress) {
  // https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool#getuseraccountdata
  const {
    totalCollateralETH,
    totalDebtETH,
    availableBorrowsETH
  } = await lendingPoolContract.getUserAccountData(account.address)
  //--------------------------
  console.log('___________________________________________________')
  console.log(`You have ${ethers.utils.formatUnits(totalCollateralETH, 'ether')} worth of ETH deposited.`)
  console.log(`You have ${ethers.utils.formatUnits(totalDebtETH, 'ether')} worth of ETH borrowed.`)
  console.log(`You can borrow ${ethers.utils.formatUnits(availableBorrowsETH, 'ether')} worth of ETH.`)
  console.log('')
  //--------------------------

  return {totalDebtETH, availableBorrowsETH}
}

async function getDaiPrice() {
  // https://docs.chain.link/docs/ethereum-addresses/#Ethereum%20Mainnet (DAI / ETH)
  // 0x773616E4d11A78F511299002da57A0a94577F1f4
  // Contract Name: EACAggregatorProxy
  const daiEthPriceFeedContract: IEACAggregatorProxy = await ethers.getContractAt('IEACAggregatorProxy', '0x773616E4d11A78F511299002da57A0a94577F1f4')
  const price = (await daiEthPriceFeedContract.latestRoundData())[1]
  //--------------------------
  console.log(`The DAI / ETH price is ${ethers.utils.formatUnits(price, 'ether')}`)
  //--------------------------

  return price
}

async function borrowDAI(daiAddress: string, lendingPoolContract: ILendingPool, amountDaiToBorrowWEI: BigNumber, account: SignerWithAddress) {
  // https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool#borrow
  const tx = await lendingPoolContract.borrow(daiAddress, amountDaiToBorrowWEI, 1, 0, account.address)
  await tx.wait(1)
  //--------------------------
  console.log("✔ You've borrowed!")
  //--------------------------

}

async function repay(amount: BigNumber, daiAddress: string, lendingPoolContract: ILendingPool, account: SignerWithAddress) {
  await approveErc20(daiAddress, lendingPoolContract.address, amount, account)
  // https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool#repay
  const tx = await lendingPoolContract.repay(daiAddress, amount, 1, account.address)
  await tx.wait(1)
  //--------------------------
  console.log('✔ Repaid!')
  //--------------------------

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error detected:', error)
    process.exit(1)
  })
