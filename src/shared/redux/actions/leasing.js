import { LeasingClass } from "Classes/Leasing";
const leasing = new LeasingClass;

export const setLeasingAmount = leasingInfo => {
  return {
      type: 'ADD_LEASING_FULFILLED',
      payload: leasingInfo
  }
}

export const getLeasingHistory = (payload) => {
    return {
        type: 'GET_LEASING',
        payload: new LeasingClass().getLeaseHistory(payload)
    }
}

export const clearLeasingHistory = () => {
    return {
        type: 'CLEAR_LEASING_HISTORY',
        payload: []
    }
}

export const cancelLeasing = (payload) => {
    return {
        type: 'CANCEL_LEASING',
        payload: leasing.cancelLease(payload)
    }
}
