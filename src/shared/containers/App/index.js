require('dotenv').load();
import React, { PropTypes } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { errorPattern } from 'Utils/functions';
import styled from 'styled-components';
import { users } from 'lunes-lib';
import { createBrowserHistory } from 'history';

//COMPONENTS
import Login from 'Containers/User/Login/index';
import Home from 'Containers/Home/index';
import Portfolio from 'Containers/Portfolio/index';
import Wallet from 'Containers/Wallet/index';
import Recharge from 'Containers/Recharge/index';
import Ticket from 'Containers/Ticket/index';
import Buy from 'Containers/Buy/index';
import Leasing from 'Containers/Leasing/index';
import Configuration from 'Containers/Configuration/index';
import Privacy from 'Containers/Privacy/index';

//SUB-COMPONENTS
import { Link } from 'Components/Link';
import { TextBase } from 'Components/TextBase';
import { Text } from 'Components/Text';
import Header from './Header';
import PanelLeft from './PanelLeft';
import PanelRight from './PanelRight';
import { AuthRoute } from 'Components/AuthRoute';
// import { checkAuth }    from 'Auth/index';

//MODAL COMPONENTS
import Send from 'Containers/Wallet/PanelRight/Modal/Send/index';

import {numeral} from 'Utils/numeral';

// numeral.register('locale', 'pt-br', {
// 	delimiters: {
// 		thousands: '.',
// 		decimal: ','
// 	},
// 	abbreviations: {
//         thousand: 'mil',
//         million: 'mi',
//         billion: 'bi',
//         trillion: 'tri'
//     },
// 	currency: {
// 		symbol: 'R$'
// 	}
// });

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
`;
let WrapBalance = styled.div`
	margin-left: auto;
	padding: 0 50px 0 50px;
`;
let Balance = styled.div`
	${TextBase}
`;


class App extends React.Component {
	constructor(props){
		super(props);
		numeral.locale(this.props.currencies.locale);
	}
	componentDidMount() {
	}
	componentDidUpdate() {
	}
	render() {
		return (
			<WrapApp>
				<Header>
					<WrapLogo>
						<Logo src={'/img/logo.svg'} />
					</WrapLogo>
					<WrapBalance>
						<Balance>
						<Text clWhite txLight txInline size={'1.8rem'}> Balance: </Text>
							<Text clNormalGreen txNormal txInline offSide size={'2.3rem'} >LNS </Text>
							<Text clWhite txNormal txInline offSide size={'2.0rem'}>{`${numeral(1300).format()}`}</Text>
						</Balance>
						<Text clNormalGreen txBold txRight size={'1.2rem'}>{numeral(130.10).format('$0,0.00')}</Text>
					</WrapBalance>
				</Header>
				<Panels>
					<PanelLeft />

					<PanelRight>
						<Switch>
							<Route exact path={"/app/"} component={Home} />
							<Route exact path={"/app/home/"} component={Home} />
							<Route exact path={"/app/portfolio/"} component={Portfolio} />
							<Route exact path={"/app/wallet/"} component={Wallet} />
							<Route exact path={"/app/recharge/"} component={Recharge} />
							<Route exact path={"/app/ticket/"} component={Ticket} />
							<Route exact path={"/app/buy"} component={Buy} />
							<Route exact path={"/app/leasing"} component={Leasing} />
							<Route exact path={"/app/configuration"} component={Configuration} />
							<Route exact path={"/app/privacy"} component={Privacy} />
							<Route exact path={"/app/send"} component={Send} />
						</Switch>
					</PanelRight>
				</Panels>
			</WrapApp>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.user, 
		currencies: state.currencies
	}
}
const mapDispatchToProps = (dispatch) => {
	return {
		userLogin: (email, password) => {
			dispatch({
				type: 'USER_LOGIN',
				payload: userLogin(email, password)
			});
		}
	}
}
const userLogin = (email, password) => {
	return users.login({ email, password });
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
