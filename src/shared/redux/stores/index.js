import userReducer      from "./../reducers/userReducer.js";
import walletReducer    from "./../reducers/walletReducer.js";
import {
	createStore,
	combineReducers,
	applyMiddleware }   from "redux";
import { createLogger } from "redux-logger";
import promise          from "redux-promise-middleware";
import thunk            from "redux-thunk";
import { initialState } from './initialState';

// combineReducers({
// 		user: userReducer,
// 		wallet: walletReducer
// 	})
let store = createStore(
	combineReducers(initialState),
	{},
	applyMiddleware(createLogger(), thunk, promise())
);

export {
	store
};
