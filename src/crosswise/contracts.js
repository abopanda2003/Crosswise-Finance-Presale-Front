import { web3 } from './web3';
import { config } from '../config';

import presaleContractJSON from './abis/Presale.json';
import presaleTokenJSON from './abis/PresaleToken.json';
import crssV1TokenJSON from './abis/CrssV1Token.json';
import crssV1d1TokenJSON from './abis/CrssV1d1Token.json';
import busdJSON from './abis/BUSDToken.json'

const networkId = config.networkId;

const presaleTokenContractAddress = config.contractAddress.presaleToken[networkId];
const presaleITokenContract = new web3.eth.Contract(presaleTokenJSON.abi, presaleTokenContractAddress);

const crssV1TokenContractAddress = config.contractAddress.crssV1Token[networkId];
const crssV1ITokenContract = new web3.eth.Contract(crssV1TokenJSON.abi, crssV1TokenContractAddress);

const crssV1d1TokenContractAddress = config.contractAddress.crssV1d1Token[networkId];
const crssV1d1ITokenContract = new web3.eth.Contract(crssV1d1TokenJSON.abi, crssV1d1TokenContractAddress);

const presaleContractAddress = config.contractAddress.presale[networkId];
const IPresaleContractAddress = new web3.eth.Contract(presaleContractJSON.abi, presaleContractAddress);
const presale2ContractAddress = config.contractAddress.presale2[networkId];
const IPresale2ContractAddress = new web3.eth.Contract(presaleContractJSON.abi, presale2ContractAddress);

const busdContractAddress = config.contractAddress.busd[networkId];
const IBusdContractAddress = new web3.eth.Contract(busdJSON, busdContractAddress);

const presaleTokenContract = {
    address: presaleTokenContractAddress,
    abi: presaleTokenJSON.abi,
    contract: presaleITokenContract,
    symbol: 'CRSS',
    decimals: 18
};

const crssV1TokenContract = {
    address: crssV1TokenContractAddress,
    abi: crssV1TokenJSON.abi,
    contract: crssV1ITokenContract,
    symbol: 'CRSS V1',
    decimals: 18
};

const crssV1d1TokenContract = {
    address: crssV1d1TokenContractAddress,
    abi: crssV1d1TokenJSON.abi,
    contract: crssV1d1ITokenContract,
    symbol: 'CRSS V1.1',
    decimals: 18
};

const presaleContract = {
    address: presaleContractAddress,
    abi: presaleContractJSON.abi,
    contract: IPresaleContractAddress,
}

const presale2Contract = {
    address: presale2ContractAddress,
    abi: presaleContractJSON.abi,
    contract: IPresale2ContractAddress,
}

const busdContract = {
    address: busdContractAddress,
    abi: busdJSON,
    contract: IBusdContractAddress,
    decimals: 18
}

export {
    networkId,
    presaleTokenContract,
    crssV1TokenContract,
    crssV1d1TokenContract,
    presaleContract,
    presale2Contract,
    busdContract
}
