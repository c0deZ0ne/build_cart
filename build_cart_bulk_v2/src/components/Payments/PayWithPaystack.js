import React, { useEffect, useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { handleError, handleSuccess } from "../../utility/helpers";
import instance from "../../utility/webservices";

const PayWithPaystack = ({
  amount,
  projectId,
  orderId,
  refresh,
  onCloseModal,
  isPaymentMthd,
  setPaymentMthd,
  vaultId,
  setLoading,
  channels,
  paymentPurpose,
}) => {
  const [paystackConfig, setPaystackConfig] = useState({
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  });
  const [isSuccess, setSuccess] = useState(false);
  const initializePayment = usePaystackPayment(paystackConfig);

  const initiatePayment = async () => {
    setLoading(true);
    const payload = {
      amount: Number(amount),
      paymentMethod: "BANK_TRANSFER", //BANK_TRANSFER, CREDIT_CARD, BANK_USSD, MOBILE_MONEY, CUTSTRUCT_PAY
      paymentPurpose: paymentPurpose ?? "FUND_PROJECT_WALLET", // FUND_PROJECT_WALLET,FUND_WALLET,FUND_ORDER
      orderId: orderId, // For order only
      projectId: projectId, // For project wallet only
      vaultId,
    };
    try {
      const { data } = (await instance.post(`/payment/paystack/pay`, payload))
        .data;
      // await instance.post(`/projects/paystack/initiate-transactions`, payload)

      const { amount } = data;
      setPaystackConfig({
        ...data,
        amount: amount * 100,
        publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
        channels: channels,
        metadata: {
          orderId: orderId,
          projectId: projectId,
          vaultId,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "orderID",
              value: orderId,
            },
            {
              display_name: "Project ID",
              variable_name: "projectId",
              value: projectId,
            },
            {
              display_name: "Wallet ID",
              variable_name: "walletId",
              value: vaultId,
            },
          ],
        },
      });
      setSuccess(true);

      setLoading(false);
    } catch (error) {
      console.log(error);
      handleError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      initializePayment(
        handlePaystackSuccessPayment,
        handleClosePaystackPayment,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    initiatePayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaymentMthd]);

  const handleClosePaystackPayment = () => {
    handleError("Payment Cancelled");
    setSuccess(false);
  };

  const handlePaystackSuccessPayment = (responseData) => {
    setLoading(false);
    setSuccess(false);
    refresh && refresh();
    handleSuccess("Payment successful");
    onCloseModal();
  };

  return <div></div>;
};

export default PayWithPaystack;
