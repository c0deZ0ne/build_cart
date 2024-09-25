import { createContext } from "react";
import Remita from "./providers/remita";
import { useDispatch, useSelector } from "react-redux";
import paymentSlice from "./paymentSlice";
import Paystack from "./providers/paystack";
export const PaymentContext = createContext({});

export const PaymentProvider = ({ children }) => {
  const {
    selectPayment,
    clearPayment,
    setAmount,
    setCallBackUrl,
    setCallPaymentType,
  } = paymentSlice.actions;
  const { element } = useSelector((state) => state.payment);
  const dispatch = useDispatch();
  const initializePaymentContext = (details) => {
    const {
      title,
      description,
      meta,
      callbackUrl,
      user,
      firstName,
      lastName,
      phoneNumber,
      email,
      closeModal,
      paymentType,
    } = details;
    console.log(details);
    if (!callbackUrl)
      throw "Please provide callback url server endpoint to complete the payment";
    if (title === "Remita") {
      dispatch(setCallBackUrl(callbackUrl));
      dispatch(setCallPaymentType(paymentType));
      dispatch(
        selectPayment({
          element: (
            <Remita
              {...{
                title,
                description,
                meta,
                callbackUrl,
                user,
                firstName,
                lastName,
                phoneNumber,
                email,
                closeBaseModal: closeModal,
              }}
            />
          ),
        }),
      );
    } else if (title === "Paystack") {
      dispatch(setCallBackUrl(callbackUrl));
      dispatch(setCallPaymentType(paymentType));
      dispatch(
        selectPayment({
          element: (
            <Paystack
              {...{
                title,
                description,
                meta,
                callbackUrl,
                user,
                firstName,
                lastName,
                phoneNumber,
                email,
                closeBaseModal: closeModal,
              }}
            />
          ),
        }),
      );
    } else {
      dispatch(clearPayment());
    }
  };

  const contextValue = {
    initializePaymentContext,
    selectPayment,
    clearPayment,
    element,
    setAmount,
    setCallBackUrl,
  };

  return (
    <PaymentContext.Provider value={contextValue}>
      {children}
    </PaymentContext.Provider>
  );
};
