import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  processing: false,
  paymentMethod: null,
  element: null,
  paymentDetails: null,
  amount: 0,
  callBackUrl: null,
  paymentType: null, // "ACCOUNT_WALLET_TOP_UP"
};

export const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    selectPayment: (state, action) => {
      console.log(state, action);
      state.element = action.payload.element;
      state.processing = true;
      state.paymentDetails = action.payload.paymentDetails;
      return state;
    },

    clearPayment: (state, action) => {
      state = initialState;
      return state;
    },
    setAmount: (state, action) => {
      state.amount = action.payload;
      return state;
    },
    setCallBackUrl: (state, action) => {
      state.callBackUrl = action.payload;
      return state;
    },
    setCallPaymentType: (state, action) => {
      state.paymentType = action.payload;
      return state;
    },
  },
});

export const { selectPayment, clearPayment } = paymentSlice.actions;
export const paymentSelector = (state) => state.payment;
export default paymentSlice;
