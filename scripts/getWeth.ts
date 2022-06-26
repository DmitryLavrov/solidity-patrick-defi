import {ethers, getNamedAccounts} from 'hardhat'
import {Weth} from '../typechain'

export const AMOUNT = ethers.utils.parseEther('0.02')

// https://docs.aave.com/developers/v/2.0/deployed-contracts/deployed-contracts
export const WETH_TOKEN_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

export async function getWeth() {
  const {deployer} = await getNamedAccounts()
  const signer = await ethers.getSigner(deployer)


  const wethContract: Weth = await ethers.getContractAt('Weth', WETH_TOKEN_ADDRESS, signer)
  const tx = await wethContract.deposit({value: AMOUNT})
  await tx.wait(1)
  const wethBalance = await wethContract.balanceOf(deployer)
  //--------------------------
  console.log(`Got ${ethers.utils.formatUnits( wethBalance, 'ether')} ETH`,)
  //--------------------------
}
