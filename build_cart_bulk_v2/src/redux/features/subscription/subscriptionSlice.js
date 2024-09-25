import { createSlice } from "@reduxjs/toolkit";
import { daysDiff } from "../../../utility/helpers";

const initialState = {
  interval: 1000 * 60 * 60 * 24, // 1 day
  showSubscriptionTimer: true,
};

export const subscriptionSlice = createSlice({
  name: "subscriptionState",
  initialState,
  reducers: {
    resetCountDownState: (state) => {
      state.showSubscriptionTimer = true;
    },
    showCountDownTimer: (state) => {
      state.showSubscriptionTimer = true;
    },
    closeCountDownTimer: (state) => {
      state.showSubscriptionTimer = false;
    },
    subscriptionChecker: (state) => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { subscription } = userInfo ?? {};
      let days = daysDiff(new Date(), subscription?.expirationDate);

      if (userInfo) {
        if (days <= 14) {
          userInfo.isSubscribe = true;
          userInfo.showSubscriptionCounter = true;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
          if (days <= 0) {
            userInfo.isSubscribe = false;
            userInfo.showSubscriptionCounter = true;
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
          }
        } else {
          userInfo.isSubscribe = true;
          userInfo.showSubscriptionCounter = false;
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        }
      }
    },
  },
});

export const {
  resetCountDownState,
  showCountDownTimer,
  closeCountDownTimer,
  subscriptionChecker,
} = subscriptionSlice.actions;
export const subscriptionData = (state) => state.subscriptionState;

export default subscriptionSlice;
