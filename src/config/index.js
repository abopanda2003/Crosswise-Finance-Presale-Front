import sample from 'lodash/sample'

require('dotenv').config();

export const REACT_APP_CHAIN_ID = parseInt(process.env.REACT_APP_NETWORK_ID, 10);

export const POLLING_INTERVAL = 12000

export const REACT_APP_NODE_1 = process.env.REACT_APP_NODE_1;

export const REACT_APP_NODE_2 = process.env.REACT_APP_NODE_2;

export const REACT_APP_NODE_3 = process.env.REACT_APP_NODE_3;

export const nodes = [REACT_APP_NODE_1, REACT_APP_NODE_2, REACT_APP_NODE_3]

export const getRpcUrl = () => {
  return sample(nodes)
}

const web3Provider = getRpcUrl();

export const config = {
  web3Provider: web3Provider,
  networkId: process.env.REACT_APP_NETWORK_ID,
  contractAddress: {
    presaleToken: {
      56: '0x0999ba9aEA33DcA5B615fFc9F8f88D260eAB74F1',
      97: '0xdB1e3264dEAe2C5E7FBB1cA8760def9154066568'
    },
    crssV1Token: {
      56: '0x55eCCd64324d35CB56F3d3e5b1544a9D18489f71',
      97: '0x4C2328E9b7a4554843Ef21631c0Db650095961CA'
    },
    crssV1d1Token: {
      56: '0x99FEFBC5cA74cc740395D65D384EDD52Cb3088Bb',
      97: '0xC32921525e5116433d7A5Ad387f54c1F3C5DfC11'
    },
    presale: {
      56: '0xAd3f5A4526fbEd82A865d1BaeF14153488f86487',
      97: '0xB824C16fcbDc74f98691E67644f492780e1BDB61'
    },
    presale2: {
      56: '0x3DC2b7E5dc5274C2d603342E73D1d0A9DE96796A',
      97: '0xb70E68d2e908481afaE5bCfF788972ff3af7Ab25'
    },
    busd: {
      56: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      97: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee'
    }
  },
};

export const BASE_BSC_SCAN_URL = {
  56: 'https://bscscan.com',
  97: 'https://testnet.bscscan.com',
};

export const connectorNames = {
  Injected: 'Injected',
  BSC: 'bsc',
  WalletConnect: 'WalletConnect',
}

const presaleDeadlineDate = new Date('2022-01-02T14:00:00');
// convert into utc timezone
const presaleTimezoneOffset = new Date().getTimezoneOffset();
const utcPresaleTime = presaleDeadlineDate.getTime() - presaleTimezoneOffset * 60 * 1000;

export const PresaleDeadline = Math.floor(utcPresaleTime / 1000);
