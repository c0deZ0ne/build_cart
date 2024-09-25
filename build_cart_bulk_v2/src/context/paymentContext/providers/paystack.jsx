import React, { useState, useEffect } from "react";
import Button from "../../../components/Button";
import instance from "../../../utility/webservices";
import { handleError, handleSuccess } from "../../../utility/helpers";
import { usePaystackPayment } from "react-paystack";
import { useDispatch, useSelector } from "react-redux";
import paymentSlice from "../../../context/paymentContext/paymentSlice";

function Paystack({ title = "Pay With Paystack", closeBaseModal, refresh }) {
  const [isLoading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [userAccountInfo, setUserAccountInfo] = useState({});
  const dispatch = useDispatch();
  const { amount, callBackUrl, paymentType, description, paymentMethod, meta } =
    useSelector((state) => {
      return state.payment;
    });
  const { clearPayment } = paymentSlice.actions;
  const getUserAccount = async () => {
    try {
      const { data } = (
        await instance.get(`/user/account-details?email=${user?.email}`)
      ).data;

      setUserAccountInfo(data?.wallet);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const initializePayment = usePaystackPayment({
    amount: amount * 100,
    email: user?.email,
    fullName: user?.userName,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
    metadata: {
      walletId: userAccountInfo?.id,
      account_number: userAccountInfo?.account_number,
    },
  });

  const handlePaystackSuccessPayment = (responseData) => {
    const { reference, status } = responseData;
    const transactionStatus =
      status === "success"
        ? "COMPLETED"
        : status === "pending"
        ? "PENDING"
        : "FAILED";

    instance
      .post(callBackUrl, {
        ...responseData,
        account_number: user?.wallet?.account_number,
        description: description || "Vault Account Funded",
        paymentMethod: paymentMethod ?? "BANK_TRANSFER",
        transactionStatus,
        amount,
        pay_ref: reference,
        metadata: meta,
        paymentType,
      })
      .then((data) => {
        dispatch(paymentSlice.actions.clearPayment());
        handleSuccess("Payment Successful");
      })
      .catch((err) => {
        dispatch(paymentSlice.actions.clearPayment());
        setLoading(false);
        handleError(err);
      });

    setLoading(false);
  };

  const handleClosePaystackPayment = () => {
    dispatch(paymentSlice.actions.clearPayment());
    handleError("Payment Cancelled");
    setLoading(false);
  };

  const handleClickOnPaystack = async () => {
    closeBaseModal();
    setLoading(true);

    if (amount > 0) {
      initializePayment(
        handlePaystackSuccessPayment,
        handleClosePaystackPayment,
      );
    }
  };

  return (
    <Button
      mb={10}
      isLoading={isLoading}
      full
      onClick={handleClickOnPaystack}
      mr={3}
    >
      {title || "Pay With Paystack"}
    </Button>
  );
}

export default Paystack;
