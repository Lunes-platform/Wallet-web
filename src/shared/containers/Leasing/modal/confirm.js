/**
 * Props:
 * - amount: total de Lunes enviados para leasing
 * - receiver: endereço que receberá os Lunes para leasing
 *
 * Exemplo: <ModalConfirm amount={50.00000} receiver={'3P2HNUd5VUPLMQkJmctTPEeeHumiPN2GkTb'} />
 */

import React from 'react';
import styled from 'styled-components';

// REDUX
import { connect } from 'react-redux';

// Private components
import style from 'Shared/style-variables';
import { H3, Text, Modal } from 'Components/index';
import { ButtonGreen } from 'Components/Buttons';

const Green = styled.span`
  color: ${style.normalGreen};
`;

class ModalConfirm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Modal
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        height={'70%'}
        width={'50%'}
        type={'success'}
        title={'Your leasing initiated sucessfully'}
        hr
        text={
          <div>
            <H3>{this.props.lastLeasingAmount} <Green>LUNES</Green></H3>
            <Text size={'1.2rem'} margin={'1rem'} clNormalGreen> are allocated to leasing on lunes network</Text>
            <Text size={'1.2rem'} margin={'1rem'}>Mining node address:</Text>
            <Text size={'1.2rem'} margin={'1rem'}>{this.props.toAddress}</Text>
          </div>
        }
        footer={<ButtonGreen width={'50%'}>Start a new leasing</ButtonGreen>}
      />
    );
  }
}

// REDUX
const mapStateToProps = state => {
  return {
    amount: state.leasing.lastLeasing.amount,
    toAddress: state.leasing.lastLeasing.toAddress
  }
}

export default connect(mapStateToProps)(ModalConfirm);

// export default ModalConfirm;
