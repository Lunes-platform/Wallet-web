// import userReducer       from "Redux/reducers/userReducer.js";
// import walletReducer     from "Redux/reducers/walletReducer.js";
// import balanceReducer    from "Redux/reducers/balanceReducer.js";
// import currenciesReducer from "Redux/reducers/currenciesReducer.js";
// import configReducer     from "Redux/reducers/configReducer.js";
// import cryptocurrenciesReducer from "Redux/reducers/cryptocurrenciesReducer.js";
// import walletReducer     from "Redux/reducers/componentReducer.js";
import { 
	userReducer,
	walletReducer,
	balanceReducer,
	currenciesReducer,
	cryptocurrenciesReducer,
	configReducer,
	componentReducer } from 'Redux/reducers';

export let initialState = {
	user:             userReducer,
	wallet:           walletReducer,
	config:           configReducer,
	currencies:       currenciesReducer,
	cryptocurrencies: cryptocurrenciesReducer,
	balance:          balanceReducer,
	component:        componentReducer
}