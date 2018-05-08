import React from 'react';
import styled, { css } from 'styled-components';
import style  from 'Shared/style-variables';
import { TextBase } from 'Components/TextBase';
let InputSizeBase = css`
	${props => {
		if (props.small) {
			return `height: 2.5rem; font-size: calc(2.5rem - 1rem)`;
		} else if (props.normal) {
			return `height: 3rem; font-size: calc(3rem - 1rem)`;
		} else if (props.regular) {
			return `height: 4.5rem; font-size: calc(4.5rem - 1rem)`;
		} else if (props.big) {
			return `height: 5rem; font-size: calc(5rem - 1rem)`;
		} else if (props.huge) {
			return `height: 5.5rem; font-size: calc(5.5rem - 1rem)`;
		}
	}}
	
`;
let GridBase = css`
	${props => {
		if (!props.s)
			props.s = 12;
		if (!props.m)
			props.m = 12;
		if (!props.l)
			props.l = 12;
		let sWidth = (100 / 12) * props.s;
		let mWidth = (100 / 12) * props.m;
		let lWidth = (100 / 12) * props.l;

		return `
			@media (${style.media.mobile}) {
				width: ${sWidth}%;
			}
			@media (${style.media.tablet2}) {
				width: ${mWidth}%;
			}
			@media (${style.media.desktop2}) {
				width: ${lWidth}%;
			}
		`;
	}}
`;
let BaseInput = css`
	background: transparent;
	width: 100%;
	height: 3rem;
	border: none;
	border-bottom: 0.1rem solid white;
	z-index: 1;
	${TextBase};
	${InputSizeBase};
`;


let WrapInput = styled.div`
	position: relative;
	width: 100%;
	${GridBase};
`;
let Label = styled.label`
	width: inherit;
	height: 3rem;
	position: absolute;
	top: 0px;
	left: 0px;
	z-index: -1;
	${TextBase};
	${InputSizeBase};
	text-shadow: 0px 0px 0px transparent;
	transition: all 0.3s, text-shadow 0.15s, top 0.1s;
	animation-duration: 0.5s;
`;
let StyledInput = styled.input`
	${BaseInput};
	&:focus {
		outline: none;
	}
	${props => {
		if (props.whiteTheme) {
			return `
				border-color: white;
				color: white;
				& + label {
					color: white;
					border-color: white;
					text-shadow: 0px 0px 0px white;
				}`;
		} else if (props.darkLilacTheme) {
			return `
				border-color: ${style.darkLilac};
				color: ${style.lightLilac};
				& + label {
					color: ${style.darkLilac};
					border-color: ${style.darkLilac};
					text-shadow: 0px 0px 0px ${style.darkLilac};
				}`;
		} else if (props.lightLilacTheme) {
			return `
				border-color: ${style.lightLilac};
				color: white;
				& + label {
					color: ${style.lightLilac};
					border-color: ${style.lightLilac};
					text-shadow: 0px 0px 0px ${style.lightLilac};
				}`;
		}
	}}
`;
let Text = (props) => {
	let handleOnFocus = (event) => {
		let inputEl = event.currentTarget;
		let labelEl = inputEl.parentElement.querySelector('.label');
		labelEl.style.top           = '-100%';
		labelEl.style.animationName = 'input_text_label_shadow_up';
	}
	let handleOnBlur = (event) => {
		let inputEl = event.currentTarget;
		let labelEl = inputEl.parentElement.querySelector('.label');
		if (!inputEl.value) {
			labelEl.style.top               = '0px';
			labelEl.style.animationName     = 'input_text_label_shadow_down';
		} else if (inputEl.value) {
			labelEl.style.top               = '-100%';
			labelEl.style.animationName     = 'input_text_label_shadow_up';
		}	
	}
	let { value, ...labelProps  } = props.label;
	return (
		<WrapInput {...props}>
			<StyledInput {...props} onFocus={handleOnFocus} onBlur={handleOnBlur}/>
			<Label className={'label'} {...labelProps}>
				{ value }
			</Label>
		</WrapInput>
	);
}


let WrapRadio   = styled.div`
	width: auto;
	display: flex;
	justify-content: flex-start;
	align-items: center;
`;
let StyledRadio = styled.div`
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 100%;
	border: 5px solid ${style.lightLilac};
	background: transparent;
	cursor: pointer;
	position: relative;
`;
let RadioCircle = styled.div`
	width: calc(2.5rem - 10px);
	height: calc(2.5rem - 10px);
	border-radius: 100%;
	background: transparent;
	position: absolute;
	top: -50px;
	left: 0px;
	background: ${style.normalGreen};
	z-index: 2;
	visibility: hidden;
	user-select: none;
	transition: all .1s linear;
`;
let LabelRadio = styled.div`
	${TextBase};
	padding-left: 5px;
	color: white;
	user-select: none;
`;
let Radio = (props) => {
	let handleToggleRadio = (event) => {
		let radioEl  = event.currentTarget;
		let circleEl = radioEl.children[0];
		let state   = radioEl.getAttribute('checked');
		if (!state) {
			// radioEl.style.background  = style.normalGreen;
			circleEl.style.visibility = 'visible';
			circleEl.style.opacity    = '1';
			circleEl.style.top        = '0px';
			radioEl.setAttribute('checked', 'checked');
		} else {
			// radioEl.style.background  = 'transparent';
			circleEl.style.visibility = 'hidden';
			circleEl.style.opacity    = '0';
			circleEl.style.top        = '-50px';
			radioEl.removeAttribute('checked');
		}
	}

	let { type, children, ...restProps } = props;
	let { value, ...restPropsLabel } = props.label;
	return(
		<WrapRadio>
			<StyledRadio onClick={handleToggleRadio}>
				<RadioCircle/>
			</StyledRadio>
			<LabelRadio {...restPropsLabel}>
				{ value }
			</LabelRadio>
		</WrapRadio>
	);
}

let Select = (props) => {
	let { type, children, ...restProps } = props;
	return(
		<div {...restProps}>
			{ children }
		</div>
	);
}






let Input = (props) => {
	switch (props.type) {
		case 'text': return <Text {...props}/>; break;
		case 'radio': return <Radio {...props}/>; break;
		case 'select': return <Select {...props}/>; break;
	}
	return null;
}
export default Input;

// <Input type={'text'} placeholder={'Nome'}/>
// <Input type={'radio'} label={'Quantidade em BTC'}/>

// <Input type={select}>
// 	<option>BH</option>
// 	<option>SP</option>
// </Input>

