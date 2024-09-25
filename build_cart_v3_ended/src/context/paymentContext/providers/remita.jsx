import RemitaPayment from "react-remita";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import paymentSlice from "../paymentSlice";
import { handleError, handleSuccess } from "../../../utility/helpers";

function Remita({
  title = "Pay With Remita",
  description,
  meta,
  firstName,
  lastName,
  customerId,
  phoneNumber,
  email,
  closeBaseModal,
}) {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { amount, callBackUrl, paymentType } = useSelector((state) => {
    return state.payment;
  });
  const { clearPayment } = paymentSlice.actions;
  const dispatch = useDispatch();
  const [paymentData] = useState({
    key: `${process.env.REACT_APP_REMITA_PUBLIC_KEY}`,
    customerId: customerId || "",
    firstName: firstName || user.userName.split(" ")[0],
    lastName: lastName || user.userName.split(" ")[1],
    email: email || user.email,
    phoneNumber,
    amount: amount,
    description,
    meta,
    narration: "test",
  });
  let data = {
    ...paymentData,
    onSuccess: async function (response) {
      console.log(response);
      var config = {
        method: "post",
        url: callBackUrl,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: { paymentType, pay_ref: response.transactionId },
      };
      try {
        await axios(config);
        handleSuccess("Payment Was Successful");
        dispatch(clearPayment());
      } catch (error) {
        console.error("Error making POST request:", error);
        dispatch(clearPayment());
        handleError(error.message);
      }
    },
    onError: function () {
      handleError("Couldn't process payment");
      dispatch(clearPayment());
    },
    onClose: function () {
      dispatch(clearPayment());
      closeBaseModal();
    },
  };
  return <RemitaPayment remitaData={data} className="btn" text={title} />;
}
export default Remita;
