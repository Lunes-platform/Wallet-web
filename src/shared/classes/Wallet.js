import { errorPattern } from "Utils/functions";
import { coins, services, networks } from "lunes-lib";
import sb from "satoshi-bitcoin";
import isCoinAvaliable from "Config/isCoinAvaliable";

import { MoneyClass } from 'Classes/Money';

import { 
  TESTNET, 
  APICONFIG, 
  LNSNETWORK, 
  BTCNETWORK, 
  LTCNETWORK, 
  NANONETWORK, 
  DASHNETWORK, 
  ETHNETWORK 
} from "Config/constants";

const money = new MoneyClass;

export class WalletClass {
  static coinsPrice;

  //for now, we arent using this
  getCoinsPrice = async data => {
    if (!data || Object.keys(data).length < 1) {
      data = {
        BTC: { fromSymbol: "BTC", toSymbol: "USD" },
        ETH: { fromSymbol: "ETH", toSymbol: "USD" }
      };
    }

    try {
      let coinsPrice = {};
      for (let coinKey in data) {
        coinsPrice[data[coinKey].fromSymbol] = await coins.getPrice(data[coinKey]);
      }
      return coinsPrice;
    } catch (err) {
      return errorPattern(`Error on trying to get price`, 500, "COINGETPRICE_ERROR", err);
    }
  };
  /*
		@param user: typically it comes from cookies
		returns: {btc: ['address','address', ...]}
	*/
  getUserAddresses = user => {
    try {
      let addresses = {};
      //(example): @param coin = {symbol: 'btc', createdAt: [timestamp], etc..}
      user.wallet.coins.map(coin => {
        //if addresses does not have {addresses['btc'] (example)} as attribute, so:
        if (!addresses[coin.symbol]) {
          addresses[coin.symbol] = [];
        }
        //we get the ${addresses[coin.symbol]} array, and we push an address to it
        coin.addresses.map(obj => {
          addresses[coin.symbol].push(obj.address);
        });
      });
      return addresses;
    } catch (err) {
      return errorPattern("Was not possible get user addresses", 500, "WALLET_GETUSERADDRESS_ERROR", err);
    }
  };
  /*
		@param user: typically comes from cookies
		return ex:
			{
				btc: {
					total_confirmed: 0,
					total_unconfirmed: 0,
					total_amount: 0
				}
			}
  */

  getMnemonic() {
    try {
      return services.wallet.mnemonic.generateMnemonic();
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  // addresses = { LNS: lunes addrees, BTC: bitcoin address... }
  getAddressesBalance = async addresses => {
    try {
      let balances = {};
      for (const coin in addresses) {
        if (!addresses[coin]) return false;
        balances[coin] = await coins.services.balance( coin.toUpperCase(), addresses[coin], TESTNET );
      }

      return balances;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  getBalance = async user => {
    try {
      if (typeof user === "string") {
        user = JSON.parse(user);
      }
      // let coinsPrice = await this.getCoinsPrice([
      //   { fromSymbol: "BTC", toSymbol: "BRL,USD" },
      //   { fromSymbol: "LTC", toSymbol: "BRL,USD" },
      //   { fromSymbol: "ETH", toSymbol: "BRL,USD" }
      // ]);
      // this.coinsPrice = coinsPrice;
      let addresses = this.getUserAddresses(user);
      let balance = {};
      //coin = 'btc' (example)
      for (let coin in addresses) {
        coin = coin.toUpperCase();
        //addressKey = 1 (example)
        let i = 0;
        for (let addressKey in addresses[coin]) {
          //we need to upper case it because of our pattern on redux
          let ucCoin = coin.toUpperCase();
          if (isCoinAvaliable(coin) === false) continue;
          //it gets the current addres of the iteration
          let address = addresses[coin][addressKey];
          //it returns a response object
          let response = await coins.services.balance({ network: coin, address, testnet: TESTNET });
          if (response.data) {
            //se não temos nada no objeto
            //então colocamos valores iniciais
            if (!balance[ucCoin]) {
              balance[ucCoin] = {};
              balance[ucCoin]["total_confirmed"] = sb.toSatoshi(0);
              balance[ucCoin]["total_unconfirmed"] = sb.toSatoshi(0);
              balance[ucCoin]["total_amount"] = 0;
            }
            //new total_(un)confirmed
            let confirmed = response.data.confirmed ? response.data.confirmed : 0;
            let unconfirmed = response.data.unconfirmed ? response.data.unconfirmed : 0;
            //it sums the old total_confirmed with the new
            balance[ucCoin]["total_confirmed"] += confirmed;
            balance[ucCoin]["total_unconfirmed"] += unconfirmed;
            //it converts total_(un)confirmed to bitcoin
            balance[ucCoin]["total_unconfirmed"] = sb.toBitcoin(balance[ucCoin]["total_unconfirmed"]);
            balance[ucCoin]["total_confirmed"] = sb.toBitcoin(balance[ucCoin]["total_confirmed"]);

            balance[ucCoin]["total_amount"] = balance[ucCoin]["total_confirmed"] + balance[ucCoin]["total_unconfirmed"];
          }
        }
      }
      return balance;
    } catch (err) {
      throw errorPattern("Error on get balance", 500, "WALLET_GETBALANCE_ERROR", err);
    }
  };

  getTxHistory = async ({ network = undefined, address = undefined }) => {
    console.warn(network, address, "NETWORK | ADDRESS");
    if (!network)
      throw errorPattern("getHistory error, you should pass through a network name", 500, "WALLET_GETHISTORY_ERROR");

    try {
      return coins.services.history({ network, address, testnet: TESTNET });
    } catch (err) {
      throw console.error(errorPattern("Error on get history", 500, "WALLET_GETHISTORY_ERROR", err));
    }
  };

  getCoinHistory = async object => {
    try {
      return await coins.getHistory(object);
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  validateAddress = async (coin, address) => {
    try {
      let coinUpperCase = coin.toUpperCase();
      if (coin === 'lns' || coin === 'lunes') {
        return await services.wallet.lns.validateAddress(address, networks[LNSNETWORK]);
      } else {
        return await coins.util.validateAddress(address, coinUpperCase, TESTNET);
      }  
    } catch (error) {
      console.error(error)
      return false;
    }
  };

  getNewAddress(seed, coin = null) {
    try {
      switch (coin) {
        case 'lunes':
          return services.wallet.lns.wallet.newAddress(seed, networks[LNSNETWORK]);

        case 'lns':
          return services.wallet.lns.wallet.newAddress(seed, networks[LNSNETWORK]);
        
        case 'btc':
          return services.wallet.btc.wallet.newAddress(seed, networks[BTCNETWORK]);

        case 'eth':
          return services.wallet.eth.wallet.newAddress(seed, networks[ETHNETWORK]);

        case 'ltc':
          return services.wallet.btc.wallet.newAddress(seed, networks[LTCNETWORK]);

        case 'nano':
          return services.wallet.nano.wallet.newAddress(seed, networks[NANONETWORK]);

        case 'dash':
          return services.wallet.btc.wallet.newAddress(seed, networks[DASHNETWORK]);

        default:
          return services.wallet.lns.wallet.newAddress(seed, networks[LNSNETWORK]);
      }
    } catch (error) {
      console.log(error);
      return erro;
    }
  }

  transactionSend = async (mnemonic, coin, address, amount, fee, accessToken) => {
        
    try {
      let amountConvert = amount.toString();
      let feeConvert = fee.toString();

      if (coin === "btc" || coin === "nano" || coin === "dash" || coin === "ltc") {
        amountConvert = money.conevertCoin(coin, amount);
        feeConvert = money.conevertCoin(coin, fee);
      } else if (coin === "lns" || coin === "lunes"){
        amountConvert = money.conevertCoin(coin, amount);
        eeConvert = money.conevertCoin(coin, fee);
      } else if (coin === "eth"){
        amountConvert = money.conevertCoin(coin, amount);
        ffeeConvert = money.conevertCoin(coin, fee);
      } else {
        return 'Coin not defined';
      }

      const transactionData = {
          mnemonic: mnemonic,
          network: coin,
          testnet: TESTNET,
          toAddress: address,
          amount: amountConvert,
          fee: feeConvert
      };
  
      const data = await coins.services.transaction(transactionData, accessToken);

      return data;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
