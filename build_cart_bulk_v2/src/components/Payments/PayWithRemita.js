import React from "react";
import instance from "../../utility/webservices";
import { handleError, handleSuccess } from "../../utility/helpers";
import RemitaPayment from "react-remita";
import { Box } from "@chakra-ui/react";

const PayWithRemita = ({
  onClose,
  amount,
  orderId,
  projectId,
  vaultId,
  paymentPurpose,
  closeSidebar,
  description,
  refresh,
}) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  let data = {
    key: `${process.env.REACT_APP_REMITA_PUBLIC_KEY}`,
    customerId: user?.id,
    firstName: user?.userName.split(" ")[0],
    lastName: user?.userName.split(" ")[1] ?? user?.userName.split(" ")[0],
    email: user?.email,
    amount: amount,
    paymentType: paymentPurpose,
    description,
    orderId,
    projectId,
    meta: {
      customerId: user?.id,
      orderId,
      projectId,
      firstName: user?.userName.split(" ")[0],
      lastName: user?.userName.split(" ")[1] ?? user?.userName.split(" ")[0],
      email: user?.email,
      amount: amount,
    },
    narration: "test",
    onSuccess: async function (response) {
      var payload = {
        paymentProvider: "REMITA",
        pay_ref: response?.transactionId ?? response?.paymentReference,
        reference: response?.transactionId ?? response?.paymentReference,
        userId: user?.id,
        description,
        orderId,
        projectId,
        amount,
        paymentMethod: "BANK_TRANSFER",
        paymentPurpose: paymentPurpose,
        vaultId,
      };

      try {
        const { data } = await instance.post("/payment/remita/pay", payload);
        const paymentPayload = {
          ...data.data,
          status: "SUCCESS", // ["SUCCESS",FAILED, PENDING"]
          amount: Number(amount),
          remitaReference: payload.reference,
        };

        if (data.message === "Success") {
          await instance.post(
            "/webhook/remita/verify-transactions",
            paymentPayload,
          );
          handleSuccess("Payment was successful");
          refresh();
        } else {
          handleError("Payment failed... kindly contact admin.");
        }
      } catch (error) {
        console.error("Error making POST request:", error);
        handleError(error);
      }
    },
    onError: function () {
      handleError("Couldn't process payment");
    },
  };
  return (
    <Box
      m={"0"}
      onClick={() => {
        onClose();
        closeSidebar && closeSidebar();
      }}
    >
      <RemitaPayment
        remitaData={data}
        className="btn remita-pay-button"
        style={{ width: "100%" }}
        text={"Fund Remita"}
      />
    </Box>
  );
};

export default PayWithRemita;
