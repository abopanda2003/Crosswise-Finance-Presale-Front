import React, { useState, useContext, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Container, Tooltip } from 'reactstrap';
import 'react-accessible-accordion/dist/fancy-example.css';
import { Row } from 'reactstrap';
import { BN } from 'web3-utils';
import useRefresh from '../../../redux/useRefresh'
import '../css/style.css'
import { ThemeContext } from "../../../contexts/ThemeContext";
import { PresaleDeadline } from '../../../config'
import "react-step-progress-bar/styles.css";
import { useForm } from "react-hook-form";
import { getFullDisplayBalance, getBalanceNumber } from '../../../crosswise/bn';
import { web3 } from "../../../crosswise/web3";
import {
  getPresaleTokenBalance,
  getV1TokenBalance,
  getV1d1TokenBalance,
  getUserDetail,
  getUserDetail2,
  getAmountUnlocked,
  getAmountUnlocked2,
  deposit2,
  withdrawToken,
  withdrawToken2,
  checkAllowanceBusd2,
  checkAllowancePresaleToV1d1Token,
  checkAllowanceV1ToV1d1Token,
  approveBusd2,
  approvePresaleToV1d1Token,
  approveV1ToV1d1Token,
  checkWhitelistMember2,
  convertPresaleToV1d1Tokens,
  convertV1ToV1d1Tokens
} from "../../../crosswise/token";
import useCountDown from "../../../widgets/useCountDown";
import { addTokenToWallet } from "../../../utils/wallet";
import {
  presaleTokenContract,
  crssV1TokenContract,
  crssV1d1TokenContract
} from "../../../crosswise/contracts";

const SectionPresale = (props) => {
  const address = useSelector(state => state.authUser.address);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [copyText, setCopytext] = useState('Click to copy.');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { fastRefresh } = useRefresh()
  const secondsRemaining = useCountDown(PresaleDeadline);
  
  const [amountToDeposit, setAmountToDeposit] = useState();
  const [presaleTokenAllowance, setPresaleTokenAllowance] = useState(new BN(0));
  const [presaleToV1d1TokenAllowance, setPresaleToV1d1TokenAllowance] = useState(new BN(0));
  const [v1ToV1d1TokenAllowance, setV1ToV1d1TokenAllowance] = useState(new BN(0));
  
  const [depositTime, setDepositTime] = useState(0);
  const [depositAmount, setDepositAmount] = useState(new BN(0));
  const [unlockedAmount, setUnlockedAmount] = useState(new BN(0));
  const [rewardAmount, setRewardAmount] = useState(new BN(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BN(0));

  const [depositTime2, setDepositTime2] = useState(0);
  const [depositAmount2, setDepositAmount2] = useState(new BN(0));
  const [unlockedAmount2, setUnlockedAmount2] = useState(new BN(0));
  const [rewardAmount2, setRewardAmount2] = useState(new BN(0));
  const [withdrawAmount2, setWithdrawAmount2] = useState(new BN(0));

  const [presaleTokenBalance, setPresaleTokenBalance] = useState(new BN(0));
  const [v1TokenBalance, setV1TokenBalance] = useState(new BN(0));
  const [v1d1TokenBalance, setV1d1TokenBalance] = useState(new BN(0));

  const toggle = () => {
    setTooltipOpen(!tooltipOpen);
  }

  useEffect(() => {
    loadUserDetail();
  }, [address, fastRefresh]);

  const loadUserDetail = useCallback(async () => {
    const tokenAllowrance = await checkAllowanceBusd2(address);
    const presaleToV1d1TokenAllowance = await checkAllowancePresaleToV1d1Token(address);
    const v1ToV1d1TokenAllowance = await checkAllowanceV1ToV1d1Token(address);
    
    setPresaleTokenAllowance(tokenAllowrance);
    setPresaleToV1d1TokenAllowance(presaleToV1d1TokenAllowance);
    setV1ToV1d1TokenAllowance(v1ToV1d1TokenAllowance);
    
    const result = await getUserDetail(address);
    const amountUnlocked = await getAmountUnlocked(address);
    setRewardAmount(web3.utils.toBN(result.totalRewardAmount));
    setWithdrawAmount(web3.utils.toBN(result.withdrawAmount));
    setDepositAmount(web3.utils.toBN(result.depositAmount));
    setUnlockedAmount(amountUnlocked);
    setDepositTime(parseInt(result.depositTime, 10));

    const result2 = await getUserDetail2(address);
    const amountUnlocked2 = await getAmountUnlocked2(address);
    setRewardAmount2(web3.utils.toBN(result2.totalRewardAmount));
    setWithdrawAmount2(web3.utils.toBN(result2.withdrawAmount));
    setDepositAmount2(web3.utils.toBN(result2.depositAmount)); 
    setUnlockedAmount2(amountUnlocked2);
    setDepositTime2(parseInt(result2.depositTime, 10));

    setPresaleTokenBalance(await getPresaleTokenBalance(address));
    setV1TokenBalance(await getV1TokenBalance(address));
    setV1d1TokenBalance(await getV1d1TokenBalance(address));
  }, [address, fastRefresh]);

  const approveBusd2Tokens = async () => {
    await approveBusd2(address);
  }

  const approvePresaleTokens = async () => {
    await approvePresaleToV1d1Token(address);
  }

  const approveV1Tokens = async () => {
    await approveV1ToV1d1Token(address);
  }

  const buyTokens = async () => {
    if (amountToDeposit < 1) return;
    if (secondsRemaining > 0) {
      const checkWhitelist = await checkWhitelistMember2(address);
      if (!checkWhitelist) {
        alert("Your wallet is not yet whitelisted. Please click on \"Get Whitelisted\" on our homepage to whitelist your wallet, or wait for confirmation if you have already done so. ");
        return;
      }
      try {
        await deposit2(web3.utils.toWei(amountToDeposit), address);
      } catch (error) {
        console.log(error);
        alert('Transaction has been reverted by the EVM. Please take a look at browser console and refresh page.');
      }
    }
  }

  const claimToken2 = async () => {
    if (parseFloat(unlockedAmount2.toString()) < 1) {
      alert('You currently do not have any unlocked tokens to withdraw.');
      return;
    }

    await withdrawToken2(unlockedAmount2, address);
  }

  const claimToken = async () => {
    if (parseFloat(unlockedAmount.toString()) < 1) {
      alert('You currently do not have any unlocked tokens to withdraw.');
      return;
    }

    await withdrawToken(unlockedAmount, address);
  }

  const convertPresaleToV1d1Token = async () => {
    if (presaleTokenBalance.toString() === "0") {
      return;
    }
    await convertPresaleToV1d1Tokens(address);
  }

  const convertV1ToV1d1Token = async () => {
    if (v1TokenBalance.toString() === "0") {
      return;
    }
    await convertV1ToV1d1Tokens(address);
  }

  const renderRound2 = () => {
    return (
      <div className="d-flex flex-column align-items-center presale-column">
        <div className="presale-info">
          <h5 className="title">
            {`My Round 2 Tokens`}
          </h5>
          <div className="presale_round2">
            <div className="presale_info carousel-first">
              <div className="rectangle">
                <p>Total Deposited</p>
                <h6>{getFullDisplayBalance(depositAmount2, 18, 2)} BUSD</h6>
              </div>
              <div className="rectangle">
                <p>Total Received</p>
                <h6>{getFullDisplayBalance(rewardAmount2, 18, 2)} CRSS</h6>
              </div>
            </div>

            <div className="presale_info carousel-second">
              <div className="rectangle">
                <p>Unlocked Tokens</p>
                <h6>{getFullDisplayBalance(unlockedAmount2, 18, 2)} CRSS</h6>
              </div>
              <div className="rectangle">
                <p>Total Withdrawn</p>
                <h6>{getFullDisplayBalance(withdrawAmount2, 18, 2)} CRSS</h6>
              </div>
            </div>

            <div className="claim_section">
              {/* <button
                className={`btn btn_primary claim-button presale-btns
                  ${getBalanceNumber(unlockedAmount2, 18) < 1 ? 'disabled' : ''}`}
                onClick={claimToken2}
              > */}
              <button
                className={'btn btn_primary claim-button presale-btns disabled'}
              >
                Withdraw Pre-Sale Tokens
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderRound1 = () => {
    return (
      <div className="d-flex flex-column align-items-center presale-column">
        <div className="presale-info">
          <h5 className="title">
            {`My Round 1 Tokens`}
          </h5>
          <div className="presale_round1">
            <div className="presale_info carousel-first">
              <div className="rectangle">
                <p>Total Deposited</p>
                <h6>{getFullDisplayBalance(depositAmount, 18, 2)} BUSD</h6>
              </div>
              <div className="rectangle">
                <p>Total Received</p>
                <h6>{getFullDisplayBalance(rewardAmount, 18, 2)} CRSS</h6>
              </div>
            </div>

            <div className="presale_info carousel-second">
              <div className="rectangle">
                <p>Unlocked Tokens</p>
                <h6>{getFullDisplayBalance(unlockedAmount, 18, 2)} CRSS</h6>
              </div>
              <div className="rectangle">
                <p>Total Withdrawn</p>
                <h6>{getFullDisplayBalance(withdrawAmount, 18, 2)} CRSS</h6>
              </div>
            </div>

            <div className="claim_section">
              {/* <button
                className={`btn btn_primary claim-button presale-btns
                  ${getBalanceNumber(unlockedAmount, 18, 2) < 1 ? 'disabled' : ''}`}
                onClick={claimToken}
              > */}
              <button
                className={'btn btn_primary claim-button presale-btns disabled'}
              >
                Withdraw Pre-Sale Tokens
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="header_section section-presale h-100">
      <Tooltip placement="top" isOpen={tooltipOpen} target="address-tooltip" toggle={toggle}>
        {copyText}
      </Tooltip>

      <Container className="buy-token-container">
        <Row className="w-100">
          <div className="presale-wrap w-100 mt-3">
            {secondsRemaining > 0 && (
              <div className="presale-info">
                <h5 className="title">
                  {secondsRemaining > 0 ? 'Buy Round 2 Tokens' : 'Tokens'}
                </h5>
                <p>Wallet address</p>
                <div className="wallet-address">
                  <span>{address}</span>
                </div>
                <form onSubmit={(presaleTokenAllowance > web3.utils.toBN(100))
                  ? handleSubmit(buyTokens)
                  : handleSubmit(approvePresaleTokens)}
                >
                  <p>Amount</p>
                  <div className="input-group custom-address-section">
                    <input
                      {...register('amount', { required: true, pattern: /\d+/ })}
                      className="form-control buy-token-amount"
                      value={amountToDeposit}
                      onChange={event => setAmountToDeposit(event.target.value)}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text buy-token-currency">
                        <p>BUSD</p>
                        <img
                          src="assets/images/busdsm.png"
                          className="rounded-circle"
                          style={{ width: "20px", height: "20px" }}
                          alt=""
                        />
                      </span>
                    </div>
                  </div>
                  {presaleTokenAllowance.toString() !== "0"
                    ? (
                        errors.amount && <p style={{ color: "red" }}>
                        Please enter the amount of BUSD you wish to invest.</p>
                      ) : (<p></p>)}
                  <div className="buy-tokens">
                    {
                      presaleTokenAllowance.toString() === "0" ? (<button className={`btn btn_primary presale-btns ${secondsRemaining > 0 ? '' : 'disabled'}`} onClick={approveBusd2Tokens}>
                        Approve Contract </button>) :
                        (
                          <button className={`btn btn_primary presale-btns ${secondsRemaining > 0 ? '' : 'disabled'}`} type="submit">
                            Buy Tokens
                          </button>
                        )
                    }
                  </div>
                </form>
              </div>
            )}

            <div className="presale-sub-desc">
              <h5 className="info_desc mx-auto pb-30">Token Vesting</h5>
              <p>
                Tokens are vested within <b className="textBlue">5 months</b>, with <b className="textBlue">20%</b> unlocked every <b className="textBlue">30 days</b>, from time of purchase. That means every 30 days, 20% of that batch of tokens will be unlocked and ready to be withdrawn. 
              </p>
              <p>
              Please add the CRSS token addresses to your wallet so that your tokens are visible in your assets during the process:
              </p>
              <p className="presale-address">Pre-Sale CRSS:&nbsp;
                <b
                  id="address-tooltip"
                  className="textBlue"
                  onMouseOut={() => {
                    setCopytext('Click to add to wallet.');
                  }}
                  onClick={() => addTokenToWallet(
                    presaleTokenContract.address,
                    presaleTokenContract.symbol,
                    presaleTokenContract.decimals,
                    ''
                  )}
                >
                  0x0999ba9aEA33DcA5B615fFc9F8f88D260eAB74F1
                </b>
              </p>
              <p className="presale-address">V1 CRSS:&nbsp;
                <b
                  id="address-tooltip"
                  className="textBlue"
                  onMouseOut={() => {
                    setCopytext('Click to add to wallet.');
                  }}
                  onClick={() => addTokenToWallet(
                    crssV1TokenContract.address,
                    crssV1TokenContract.symbol,
                    crssV1TokenContract.decimals,
                    ''
                  )}
                >
                  0x55eCCd64324d35CB56F3d3e5b1544a9D18489f71
                </b>
              </p>
              <p className="presale-address">V1.1 CRSS:&nbsp;
                <b
                  id="address-tooltip"
                  className="textBlue"
                  onMouseOut={() => {
                    setCopytext('Click to add to wallet.');
                  }}
                  onClick={() => addTokenToWallet(
                    crssV1d1TokenContract.address,
                    crssV1d1TokenContract.symbol,
                    crssV1d1TokenContract.decimals,
                    ''
                  )}
                >
                  0x99FEFBC5cA74cc740395D65D384EDD52Cb3088Bb
                </b>
              </p>
            </div>

            <div className="presale-sub-desc">
              <h5 className="info_desc mx-auto pb-30">Convert Tokens</h5>
              <p>
                Convert Pre-Sale and V1 CRSS to V1.1 CRSS. Only tokens already in your wallet can be converted.
              </p>
              <ol>
                <li>
                  <p>Withdraw unlocked tokens to your wallet below.</p>
                </li>
                <li>
                  <p>Approve Step 1, Step 2</p>
                  <div className="d-flex flex-row justify-content-start flex-wrap pb-15">
                    <div className="btn_primary convert-token-btn mr-15" style={{ padding: '.375rem .75rem', borderRadius: '0.25rem' }}>
                      Approve Step 1
                    </div>
                    <div className="btn_primary convert-token-btn mr-15" style={{ padding: '.375rem .75rem', borderRadius: '0.25rem' }}>
                      Approve Step 2
                    </div>
                  </div>
                </li>
                <li>
                  <p>Click here to make CRSS V1.1 visible in your wallet</p>
                </li>
                <li>
                  <p>Convert your CRSS by clicking on "Convert Tokens"</p>
                </li>
              </ol>
            </div>
          </div>
          <div className="w-100 mobile">
            <div className="d-flex flex-row justify-content-center flex-wrap w-100">
              {renderRound2()}
              {renderRound1()}            
            </div>
          </div>
          <div className="w-100 desktop">
            <div className="d-flex flex-row justify-content-center flex-wrap w-100">
              {renderRound1()}
              {renderRound2()}            
            </div>
          </div>
          {secondsRemaining <= 0 && (
            <div className="d-flex flex-row justify-content-center flex-wrap w-100">
              <div className="presale-info presale-convert">
                <h5 className="title">Convert Token (Pre-Sale to V1.1)</h5>
                <p>
                CRSS token is upgrading to enhance security and future proofing. Please convert your Pre-Sale CRSS to V1.1 CRSS. Only tokens already in your wallet can be upgraded. Please withdraw tokens to your wallet first.
                </p>
                <div className="d-flex flex-row">
                  <div className="rectangle">
                    <p>CRSS (Pre-Sale)</p>
                    <h6>{getFullDisplayBalance(presaleTokenBalance, 18, 2)} CRSS</h6>
                  </div>
                  <div className="rectangle ml-30">
                    <p>CRSS (V1.1)</p>
                    <h6>{getFullDisplayBalance(v1d1TokenBalance, 18, 2)} CRSS</h6>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end mt-20">
                  <button className="btn btn_primary presale-btns mr-15" onClick={() => addTokenToWallet(
                    crssV1d1TokenContract.address,
                    crssV1d1TokenContract.symbol,
                    crssV1d1TokenContract.decimals,
                    ''
                  )}>
                    Add to MetaMask
                  </button>
                  {
                    presaleToV1d1TokenAllowance.toString() === "0" ? (
                      <button className="btn btn_primary presale-btns" onClick={approvePresaleTokens}>
                        Approve Step 1
                      </button>
                    ) : (
                      // <button className={`btn btn_primary convert-token-btn presale-btns ${presaleTokenBalance.toString() !== "0" ? '' : 'disabled'}`} onClick={convertPresaleToV1d1Token}
                      // >
                      <button className={'btn btn_primary convert-token-btn presale-btns disabled'}>
                        Convert Tokens
                      </button>
                    )
                  }
                </div>
              </div>

              <div className="presale-info presale-convert">
                <h5 className="title">Convert Token (V1 to V1.1)</h5>
                <p>
                CRSS token is upgrading to enhance security and future proofing. Please convert your V1 CRSS to V1.1 CRSS. Only tokens already in your wallet can be upgraded. Please withdraw tokens to your wallet first.
                </p>
                <div className="d-flex flex-row">
                  <div className="rectangle">
                    <p>CRSS (V1)</p>
                    <h6>{getFullDisplayBalance(v1TokenBalance, 18, 2)} CRSS</h6>
                  </div>
                  <div className="rectangle ml-30">
                    <p>CRSS (V1.1)</p>
                    <h6>{getFullDisplayBalance(v1d1TokenBalance, 18, 2)} CRSS</h6>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end mt-20">
                  <button className="btn btn_primary presale-btns mr-15" onClick={() => addTokenToWallet(
                    crssV1d1TokenContract.address,
                    crssV1d1TokenContract.symbol,
                    crssV1d1TokenContract.decimals,
                    ''
                  )}>
                    Add to MetaMask
                  </button>
                  {
                    v1ToV1d1TokenAllowance.toString() === "0" ? (
                      <button className="btn btn_primary presale-btns" onClick={approveV1Tokens}>
                        Approve Step 2
                      </button>
                    ) : (
                      // <button className={`btn btn_primary presale-btns ${v1TokenBalance.toString() !== "0" ? '' : 'disabled'}`} onClick={convertV1ToV1d1Token}
                      // >
                      <button className={'btn btn_primary presale-btns disabled'}>
                        Convert Tokens
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          )}
        </Row>
      </Container>
    </section >
  );
}

export default SectionPresale;