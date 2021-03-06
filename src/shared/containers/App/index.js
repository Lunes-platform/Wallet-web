// require("dotenv").load();
import React, { PropTypes } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import style from "Shared/style-variables";
import NotFound from './NotFound';

import { decrypt } from "../../utils/crypt";

// REDUX
import { connect } from "react-redux";
import {
  setBalance,
  setCurrenciesPrice,
  setCryptoPrice,
  setUniqueBalance } from "Redux/actions";

//COMPONENTS
import Home from "Containers/Home/index";
import Portfolio from "Containers/Portfolio/index";
import Wallet from "Containers/Wallet/index";
import Recharge from "Containers/Recharge/index";
import Ticket from "Containers/Ticket/index";
import Buy from "Containers/Buy/index";
import Leasing from "Containers/Leasing/index";
import Configuration from "Containers/Configuration/index";
import Privacy from "Containers/Privacy/index";
import Redeem from "Containers/Redeem/index";

//SUB-COMPONENTS
import { TextBase } from "Components/TextBase";
import { Text } from "Components/Text";
import Header from "./Header";
import PanelLeft from "./PanelLeft";
import PanelRight from "./PanelRight";
import { AuthRoute } from "Components/AuthRoute";
// import { checkAuth }    from 'Auth/index';

// LIBS
import { numeral } from "Utils/numeral";

// CONSTANTS
import { ENABLEDCOINS } from "Config/constants";

let Panels = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;
let WrapApp = styled.div`
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  position: relative;

  // & > * {
  // 	overflow-y: auto;
  // }
`;
let WrapLogo = styled.div`
  padding: 2.4rem;
`;
let Logo = styled.img`
  width: 100px;
  padding-top: 0.5rem;
`;
let Version = styled.div`
  border-left: 2px solid #4CD566;
  float: right;
  margin-left: 1rem;
  padding: 1rem;
  color: #4CD566;
  font-size: 20px;
  font-weight: 700;
`;

let WrapBalance = styled.div`
  margin-left: auto;
  padding: 0 50px 0 50px;
`;
let Balance = styled.div`
  ${TextBase};
`;
const keyframesAmountLoading = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(180deg); }
`;
const AmountLoading = styled.div`
  width: 2px;
  height: 15px;
  background: ${props => props.stick ? props.stick : style.normalGreen};
  display: inline-block;

  transform: rotate(0deg);
  animation-name: ${keyframesAmountLoading};
  animation-duration: 0.2s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
  animation-delay: 0s;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    numeral.locale(this.props.currencies.locale);
    this.state = {
      render: {
        status: 'initial',
        message: ''
      }
    }
  }

  componentWillMount() {

  }

  getAddress() {
    if (this.checkAccess()) {
      let walletInfo = JSON.parse(decrypt(localStorage.getItem("WALLET-INFO")));
      if (walletInfo) {
        return walletInfo.addresses;
      }
    }
  }
  setBalances = (addresses) => {
    let upperCasedKey;
    let currentAddress;
    for (let key in addresses) {
      console.warn('setBalances -> key & address', key+ ' - ' +addresses[key]);
      currentAddress = addresses[key];
      upperCasedKey  = key.toUpperCase();
      this.props.setUniqueBalance({address: currentAddress, network: upperCasedKey});
    }
  }
  componentDidCatch(err, info) {
    console.error('ERROR::',err);
    console.error('INFO::', info);
    this.setState({
      render: {
        status: 'error',
        message: `Fatal error on trying to access ${this.props.location.pathname}`
      }
    });
  }
  componentDidMount() {
    let addresses = this.getAddress();

    this.setBalances(addresses);
    // this.props.setBalance({ addresses });
    this.props.setCurrenciesPrice();
    this.props.setCryptoPrice();
  }

  componentDidUpdate() {
    this.checkAccess();
  }

  checkAccess() {
    let err = 0;
    let walletInfo = localStorage.getItem("WALLET-INFO");
    let accessToken = localStorage.getItem("ACCESS-TOKEN");

    if (!walletInfo) {
      err += 1;
    } else {
      walletInfo = JSON.parse(decrypt(localStorage.getItem("WALLET-INFO")));
      ENABLEDCOINS.map( coin => {
        if (!walletInfo.addresses[coin.coinKey]) {
          err += 1;
        }
      });
    }


    if (!accessToken) {
      err += 1;
    }

    if(err > 0) {
      localStorage.clear();
      this.props.history.push("/");
      location.reload();
      return false;
    }

    return true;
  }

  render() {
    if (this.state.render.status === 'error') {
      return (
        <div style={{height: '100vh', color:'white', display: 'flex', justifyContent:'center',alignItems:'center'}}>
          <h1>{this.state.render.message}</h1>
        </div>
      );
    }

    let { crypto } = this.props.currencies;

    let usdCurrent = crypto.LNS.USD;
    let lunesBalanceStatus = this.props.balance.LNS.status;
    let lunesAmount = this.props.balance.LNS.total_confirmed;

    let lnsBalance = numeral(lunesAmount).format("0,0.00000000");
    let usdBalance = numeral(lunesAmount * usdCurrent).format("$0,0.00");

    return (
      <WrapApp>
        <Header>
          <WrapLogo>
            <Logo src={"/img/logo.svg"} />
            <Version> BETA </Version>
          </WrapLogo>
          <WrapBalance>
            <Balance>
              <Text clWhite txLight txInline size={"1.8rem"}>
                {" "}
                Balance:{" "}
              </Text>
              <Text clNormalGreen txNormal txInline offSide size={"2.3rem"}>
                LUNES{" "}
              </Text>
              <Text clWhite txNormal txInline offSide size={"2.0rem"}>
                { lunesBalanceStatus.type === 'loading' ? <AmountLoading stick={style.normalGreen}/> : lnsBalance }
              </Text>
            </Balance>
            <Text clNormalGreen txBold txRight size={"1.2rem"}>
              {usdBalance}
            </Text>
          </WrapBalance>
        </Header>
        <Panels>
          <PanelLeft history={this.props.history} />

          <PanelRight>
            <Switch>
              <Route exact path={"/app"} component={Home} />
              <Route exact path={"/app/home"} component={Home} />
              <Route exact path={"/app/portfolio"} component={Portfolio} />
              <Route exact path={"/app/wallet"} component={Wallet} />
              <Route exact path={"/app/recharge"} component={Recharge} />
              <Route exact path={"/app/ticket"} component={Ticket} />
              <Route exact path={"/app/buy"} component={Buy} />
              <Route exact path={"/app/leasing"} component={Leasing} />
              <Route exact path={"/app/configuration"} component={Configuration} />
              <Route exact path={"/app/privacy"} component={Privacy} />
              <Route exact path={"/app/redeem"} component={Redeem} />
              <Route path={"**"} component={NotFound} />
            </Switch>
          </PanelRight>
        </Panels>
      </WrapApp>
    );
  }
}

const mapStateToProps = state => {
  return {
    balance: state.balance,
    currencies: state.currencies,
    cryptoPrice: state.currencies.crypto,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCurrenciesPrice: () => {
      dispatch(setCurrenciesPrice());
    },
    setCryptoPrice: () => {
      dispatch(setCryptoPrice());
    },
    setBalance: data => {
      dispatch(setBalance(data));
    },
    setUniqueBalance: data => {
      dispatch(setUniqueBalance(data));
    }
  };
};

// export default App

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
