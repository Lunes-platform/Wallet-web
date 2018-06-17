import React, { Component } from "react";

import { Col, Row } from "Components/index";
import { ButtonGreen } from "Components/Buttons";
import { numeral } from 'Utils/numeral';
import { InputText } from 'Components/forms/input-text';
import { LeasingClass } from 'Classes/Leasing';
import ModalConfirm from './confirm';

// REDUX
import { connect } from 'react-redux';
import { setLeasingAmount } from 'Redux/actions';

import {
    Background,
    QuantityAmount,
    LeasingStyleModalCss,
    Close,
    Rectangle,
    TextCenter,
    Image,
    CoinValue,
    Line,
    NumberPorcent,
    DivNumber,
    DivButton,
    DivText,
    TextLeft,
    LineText,
    Textphrase,
    TextFee,
    TextError
} from "./css";

class LeasingModal extends Component {
    constructor() {
        super();

        this.state = {
            amount: 0,
            toAddress: '',
            openConfirmModal: false
        }

        this.setInputValue = this.setInputValue.bind(this);
        this.toggleConfirmModal = this.toggleConfirmModal.bind(this);
    }

    startLeasing = () => {
      let err = 0;
      if (this.state.amount < 1) {
        err++;
      }

      if (err > 0) {
        return this.showError();
      }

      const leaseData = {
        toAddress: this.state.toAddress.trim(),
        amount: this.state.amount,
        fee: "100000",
        testnet: true
      };

      // const leasing = new LeasingClass();
      // leasing.startLease(leaseData)
      //   .then(res => {
      //     if (res.code) {
      //       throw res;
      //     }

      //     console.log(res);
      //     this.handleModal();
      //     return this.toggleConfirmModal();
      //   }).catch(err => {
      //     this.showError();
      //     return console.error(err)
      //   });
      }

    // Chama o envento da modal
    handleModal = () => {
        let modalClass = document.querySelector(".modal-status");

        return modalClass.style.display = "none";
    }

    toggleConfirmModal = () => {
      this.setState(prevState => ({
        openConfirmModal: !prevState.openConfirmModal
      }));
    }

    // Atualiza o valor de acordo com percentual informado
    leasingPercentCalculator = value => {
        this.setState({
            amount: (this.props.balance.LNS.total_confirmed * value) / 100
        });
    }

    // Atualiza o valor percentual
    setInputValue = value => {
        this.setState({
            amount: value
        });
    }

    // Atualiza o valor do endereço de envio
    setInputToAddress = value => {
        this.setState({
            toAddress: value,
        });
    }

    showError = () => {
      const textError = document.querySelector('.error-message');
      textError.style.visibility = 'visible';

      setTimeout(() => {
        textError.style.visibility = 'hidden';
      }, 3000);
    }

    componentDidUpdate() {
      this.props.setLeasingAmount({
        toAddress: this.state.toAddress.trim(),
        amount: this.state.amount
      });
    }

    render() {
        return (
          <div>
            <Background className={"modal-status"}>
                <LeasingStyleModalCss>
                    <Col defaultAlign={"center"} s={12} m={12} l={12}>
                        <Row>
                            <Close onClick={this.handleModal}>x</Close>

                            <Image src="/img/coins/lns.svg" />
                            <CoinValue offSide>{numeral(this.props.balance.LNS.total_confirmed).format('0,0.00000000')}</CoinValue>

                            <Rectangle>
                                <Row>
                                    <div>
                                        <TextCenter clWhite>Quantidade</TextCenter>
                                    </div>
                                </Row>
                                <Row>
                                    <QuantityAmount clNormalGreen>
                                        <InputText
                                            type={'number'}
                                            onChange={(value) => this.setInputValue(value.target.value)}
                                            noBorder
                                            txCenter
                                            clNormalGreen
                                            placeholder={'0.00000000'}
                                            value={this.state.amount}
                                            min="0" />
                                    </QuantityAmount>
                                </Row>
                            </Rectangle>
                        </Row>

                        <Row>
                            <DivNumber>
                                <NumberPorcent marginRight={"35%"} clNormalGreen onClick={() => this.leasingPercentCalculator(25)}> 25%</NumberPorcent>
                                <NumberPorcent marginRight={"27%"} clMostard onClick={() => this.leasingPercentCalculator(50)}>50%</NumberPorcent>
                                <NumberPorcent clNormalRed onClick={() => this.leasingPercentCalculator(100)}>100%</NumberPorcent>
                                <Line />
                            </DivNumber>
                        </Row>
                        <Row>
                            <DivText>
                                <TextLeft clWhite>Destinatário</TextLeft>
                                <Textphrase>
                                    <InputText
                                        onChange={(value) => this.setInputToAddress(value.target.value)}
                                        clWhite
                                        noBorder
                                        txCenter
                                        value={this.state.toAddress}
                                        placeholder={'clWhite3P2HNUd5VUPLMQkJ9stf...'} />
                                </Textphrase>
                                <LineText />
                            </DivText>
                        </Row>

                        <Row>
                            <DivText inline>
                                <TextLeft clWhite>Fee
                                    <TextFee>0.001</TextFee>
                                </TextLeft>

                                <LineText />
                            </DivText>
                        </Row>
                        <Row>
                            <DivButton>
                                <TextError className="error-message" size={'1.4rem'} txCenter margin={'-1rem 0 1rem 0'}>Something wrong happened! :(</TextError>
                                <ButtonGreen onClick={this.startLeasing}>INICIAR LEASING</ButtonGreen>
                            </DivButton>
                        </Row>
                    </Col>
                </LeasingStyleModalCss>
            </Background>
            {/* <ModalConfirm isOpen={this.state.openConfirmModal} onClose={this.toggleConfirmModal} amount={this.state.amount} /> */}
          </div>

        );
    }
}

const mapStateToProps = state => {
  return {
    balance: state.balance,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLeasingAmount: data => {
      dispatch(setLeasingAmount(data));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeasingModal);
