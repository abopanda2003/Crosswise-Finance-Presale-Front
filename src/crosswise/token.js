import {
  presaleContract,
  presale2Contract,
  presaleTokenContract,
  crssV1TokenContract,
  crssV1d1TokenContract,
  busdContract
} from './contracts'
import { getWeb3 } from './web3'
import { ethers } from 'ethers'

//Getters
export const getPresaleTokenBalance = async (address) => {
  const web3 = await getWeb3();
  const result = await presaleTokenContract.contract.methods.balanceOf(address).call();
  return new web3.utils.toBN(result);
}

export const getV1TokenBalance = async (address) => {
  const web3 = await getWeb3();
  const result = await crssV1TokenContract.contract.methods.balanceOf(address).call();
  return new web3.utils.toBN(result);
}

export const getV1d1TokenBalance = async (address) => {
  const web3 = await getWeb3();
  const result = await crssV1d1TokenContract.contract.methods.balanceOf(address).call();
  return new web3.utils.toBN(result);
}

export const checkAllowanceBusd = async(owner) => {
  const web3 = await getWeb3();
  const spender = presaleContract.address;
  const result = await busdContract.contract.methods.allowance(owner, spender).call();
  return new web3.utils.toBN(result);
}

export const checkAllowanceBusd2 = async(owner) => {
  const web3 = await getWeb3();
  const spender = presale2Contract.address;
  const result = await busdContract.contract.methods.allowance(owner, spender).call();
  return new web3.utils.toBN(result);
}

export const checkAllowancePresaleToV1d1Token = async(owner) => {
  const web3 = await getWeb3();
  const spender = crssV1d1TokenContract.address;
  const result = await presaleTokenContract.contract.methods.allowance(owner, spender).call();
  return new web3.utils.toBN(result);
}

export const checkAllowanceV1ToV1d1Token = async(owner) => {
  const web3 = await getWeb3();
  const spender = crssV1d1TokenContract.address;
  const result = await crssV1TokenContract.contract.methods.allowance(owner, spender).call();
  return new web3.utils.toBN(result);
}

export const getUserDetail = async (address) => {
  const result = await presaleContract.contract.methods.userDetail(address).call();
  return result;
}

export const getUserDetail2 = async (address) => {
  const result = await presale2Contract.contract.methods.userDetail(address).call();
  return result;
}

export const getAmountUnlocked = async (address) => {
  const web3 = await getWeb3();
  return new web3.utils.toBN(await presaleContract.contract.methods.unlockedToken(address).call())
};

export const getAmountUnlocked2 = async (address) => {
  const web3 = await getWeb3();
  return new web3.utils.toBN(await presale2Contract.contract.methods.unlockedToken(address).call())
};

export const checkWhitelistMember = async (address) => {
  const result = await presaleContract.contract.methods.whitelist(address).call();
  return result;
}

export const checkWhitelistMember2 = async (address) => {
  const result = await presale2Contract.contract.methods.whitelist(address).call();
  return result;
}

export const getPresaleTokenPrice = async () => {
  const result = await presaleContract.contract.methods.tokenPrice().call();
  return result;
}

export const getPresaleTokenPrice2 = async () => {
  const result = await presale2Contract.contract.methods.tokenPrice().call();
  return result;
}

export const getTotalDepositedAmount = async () => {
  const web3 = await getWeb3();
  const result  = await presaleContract.contract.methods.totalDepositedBusdBalance().call();
  return new web3.utils.toBN(result);
}

export const getTotalDepositedAmount2 = async () => {
  const web3 = await getWeb3();
  const result  = await presale2Contract.contract.methods.totalDepositedBusdBalance().call();
  return new web3.utils.toBN(result);
}

export const getTotalRewardAmount = async () => {
  const web3 = await getWeb3();
  const result  = await presaleContract.contract.methods.totalRewardAmount().call();
  return new web3.utils.toBN(result);
}

export const getTotalRewardAmount2 = async () => {
  const web3 = await getWeb3();
  const result  = await presale2Contract.contract.methods.totalRewardAmount().call();
  return new web3.utils.toBN(result);
}

//Setters
export const approveBusd = async (address) => {
  const web3 = await getWeb3();
  const spender = presaleContract.address;
  const contract = new web3.eth.Contract(
    busdContract.abi,
    busdContract.address, {from: address}
  );
  const result = await contract.methods.approve(spender, ethers.constants.MaxUint256).send({from: address})
  return result;
}

//Setters
export const approveBusd2 = async (address) => {
  const web3 = await getWeb3();
  const spender = presale2Contract.address;
  const contract = new web3.eth.Contract(
    busdContract.abi,
    busdContract.address, {from: address}
  );
  const result = await contract.methods.approve(spender, ethers.constants.MaxUint256).send({from: address})
  return result;
}

export const approvePresaleToV1d1Token = async (address) => {
  const web3 = await getWeb3();
  const spender = crssV1d1TokenContract.address;
  const contract = new web3.eth.Contract(
    presaleTokenContract.abi,
    presaleTokenContract.address, {from: address}
  );
  const result = await contract.methods.approve(spender, ethers.constants.MaxUint256).send({from: address})
  return result;
}

export const approveV1ToV1d1Token = async (address) => {
  const web3 = await getWeb3();
  const spender = crssV1d1TokenContract.address;
  const contract = new web3.eth.Contract(
    crssV1TokenContract.abi,
    crssV1TokenContract.address, {from: address}
  );
  const result = await contract.methods.approve(spender, ethers.constants.MaxUint256).send({from: address})
  return result;
}

export const deposit = async (amount, address) => {
  const web3 = await getWeb3();
  const contract = new web3.eth.Contract(
    presaleContract.abi,
    presaleContract.address, {from: address}
  );
  return await contract.methods.deposit(amount).send({ from: address });
}

export const deposit2 = async (amount, address) => {
  const web3 = await getWeb3();
  const contract = new web3.eth.Contract(
    presale2Contract.abi,
    presale2Contract.address, {from: address}
  );
  return await contract.methods.deposit(amount).send({ from: address });
}

export const withdrawToken = async (amount, address) => {
  const web3 = await getWeb3();
  const contract = new web3.eth.Contract(
    presaleContract.abi,
    presaleContract.address, {from: address}
  );
  const estimateGas = await contract.methods.withdrawToken(amount).estimateGas();
  return await contract.methods.withdrawToken(amount).send({ from: address, gas: estimateGas });
}

export const withdrawToken2 = async (amount, address) => {
  const web3 = await getWeb3();
  const contract = new web3.eth.Contract(
    presale2Contract.abi,
    presale2Contract.address, {from: address}
  );
  const estimateGas = await contract.methods.withdrawToken(amount).estimateGas();
  return await contract.methods.withdrawToken(amount).send({ from: address, gas: estimateGas });
}

export const convertPresaleToV1d1Tokens = async (address) => {
  const web3 = await getWeb3();
  const contract = new web3.eth.Contract(
    crssV1d1TokenContract.abi,
    crssV1d1TokenContract.address, {from: address}
  );
  const estimateGas = await contract.methods.claimV1Token().estimateGas();
  return await contract.methods.claimV1Token().send({ from: address, gas: estimateGas });
}

export const convertV1ToV1d1Tokens = async (address) => {
  const web3 = await getWeb3();
  const contract = new web3.eth.Contract(
    crssV1d1TokenContract.abi,
    crssV1d1TokenContract.address, {from: address}
  );
  const estimateGas = await contract.methods.claimV1Token().estimateGas();
  return await contract.methods.claimV1Token().send({ from: address, gas: estimateGas });
}