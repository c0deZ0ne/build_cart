import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  is_Loading: false,
  deliveryAddressCheck: false,
  payloadCheck: false,
  deliveryDateCheck: false,
  startPreview: false,
  Is_New: false,
  bid: 0,
  updatePjt: true,
  projectTitleName: '',
  itemChosen: {},
  payloadData: [],
  payment: false,
};

export const rfqSlice = createSlice({
  name: 'rfq',
  initialState,
  reducers: {
    checkLoading: (state, action) => {
      state.is_Loading = action.payload;
    },
    checkDeliveryAddress: (state, action) => {
      state.deliveryAddressCheck = action.payload;
    },
    checkDeliveryDate: (state, action) => {
      state.deliveryDateCheck = action.payload;
    },
    checkIsNew: (state, action) => {
      state.Is_New = action.payload;
    },
    bidLength: (state, action) => {
      state.bid = action.payload;
    },
    updateProject: (state, action) => {
      state.bid = action.payload;
    },
    launchPreview: (state, action) => {
      state.startPreview = action.payload;
    },
    changeProjectTitle: (state, action) => {
      state.projectTitleName = action.payload;
    },
    handleItemChosen: (state, action) => {
      state.itemChosen = action.payload;
    },
    handlePayloadData: (state, action) => {
      state.payloadData = action.payload;
    },
    choosePayment: (state, action) => {
      state.payment = action.payload;
    },
  },
});

export const {
  checkLoading,
  checkDeliveryAddress,
  checkDeliveryDate,
  launchPreview,
  checkIsNew,
  bidLength,
  changeProjectTitle,
  updateProject,
  handleItemChosen,
  handlePayloadData,
  choosePayment,
} = rfqSlice.actions;

export default rfqSlice.reducer;
