import React, { useEffect, useState } from "react";
import { Box, Center, Grid, GridItem, Image, Text } from "@chakra-ui/react";
import Input from "../Input";
import Button from "../Button";
import BaseModal from "./Modal";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { handleError, handleSuccess } from "../../utility/helpers";
import Paystack from "../../assets/images/pay-paystack2.svg";
import Remita from "../../assets/images/pay-remita2.svg";
import instance from "../../utility/webservices";
import RemitaPayment from "react-remita";
import { usePaystackPayment } from "react-paystack";
import { lowerCase, upperCase } from "lodash";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

const PaymentSubscriptionModal = ({
  onOpen,
  reOpen,
  isOpen,
  onClose,
  onCloseSubscription,
  closeSidebar,
}) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const userType = lowerCase(user.userType).replaceAll(" ", "-");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaymentMthd, setPaymentMthd] = useState(false);
  const [paystackConfig, setPaystackConfig] = useState({
    email: user?.email,
    fullName: user?.userName,
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
  });
  const [amount, setAmount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isPaystack, setIsPaystack] = useState(false);
  const initializePayment = usePaystackPayment(paystackConfig);
  const history = useHistory();
  const paymentMethods = [
    { title: "Remita", url: Remita, bg: "#F1652129" },
    { title: "Paystack", url: Paystack, bg: "#2DBDEF29" },
  ];

  const schema = yup.object({
    amount: yup
      .string()
      .required("Amount is required")
      .test({
        name: "min",
        message: "Invalid amount",
        test: (value) => parseInt(value, 10) >= 1,
      }),
  });

  const methods = useForm({
    defaultValues: {
      amount: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const handlePaymentMethod = (mthd) => {
    setIsPaystack(false);
    setPaymentMethod(mthd);
  };

  // PAYSTACK METHOD STARTS ----------------------------------------------------------------

  const onSubmit = async (data) => {
    const config = {
      amount: amount * 100,
      email: user?.email,
      fullName: user?.userName,
      publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      metadata: {
        userId: user?.id,
        fullName: user?.userName,
        custom_fields: [
          {
            display_name: "User ID",
            variable_name: "userID",
            value: user?.id,
          },
          {
            display_name: "Full Name",
            variable_name: "fullName",
            value: user?.userName,
          },
        ],
      },
    };
    try {
      setPaymentMthd(!isPaymentMthd);

      if (paymentMethod === "Paystack") {
        setPaystackConfig(() => config);
        setIsPaystack(true);
      } else {
        handleError("Payment method is not supported!");
        setLoading(false);
      }
    } catch (error) {
      handleError("Unable to make payment!");
      setLoading(false);
    }
  };

  const handleClosePaystackPayment = () => {
    handleError("Payment Cancelled");
    onCloseModal();
    setLoading(false);
  };

  const handlePaystackSuccessPayment = (responseData) => {
    const { reference, status } = responseData;
    user.isSubscribe = true;
    let transactionStatus =
      status === "success"
        ? "COMPLETED"
        : status === "pending"
        ? "PENDING"
        : "FAILED";

    instance
      .post("/subscriptions/subscribe-premium", {
        ...responseData,
        description: "Platform subscription",
        paymentMethod: paymentMethod ?? "BANK_TRANSFER",
        transactionStatus,
        amount,
        PaymentProvide: upperCase(paymentMethod),
        ref: reference,
        pay_ref: reference,
        userId: user?.id,
      })
      .then((data) => {
        handleSuccess("Payment Successful");
        onCloseModal();
        onClose && onClose();
        user.subscription = data.data.data;
        localStorage.setItem("userInfo", JSON.stringify(user));
      })
      .then(() => history.replace(`/${userType}/dashboard`))
      .catch((err) => {
        handleError(err);
      });
  };

  useEffect(() => {
    setLoading(false);

    if (amount > 0 && isPaystack) {
      initializePayment(
        handlePaystackSuccessPayment,
        handleClosePaystackPayment,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaystack]);

  // PAYSTACK METHOD ENDS --------------------------------------------------------------------------------

  // REMITA METHOD STARTS --------------------------------------------------------------------------------

  let remitaData = {
    key: `${process.env.REACT_APP_REMITA_PUBLIC_KEY}`,
    customerId: user?.id,
    firstName: user?.userName.split(" ")[0],
    lastName: user?.userName.split(" ")[1] ?? user?.userName.split(" ")[0],
    email: user?.email,
    amount: amount,
    description: "Platform subscription",
    meta: {
      customerId: user?.id,
      firstName: user?.userName.split(" ")[0],
      lastName: user?.userName.split(" ")[1] ?? user?.userName.split(" ")[0],
      email: user?.email,
      amount: amount,
    },
    narration: "test",
    onSuccess: async function (response) {
      var config = {
        method: "post",
        url: "/subscriptions/subscribe-premium",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          PaymentProvide: "REMITA",
          pay_ref: response?.transactionId ?? response?.paymentReference,
          userId: user?.id,
          description: "Platform subscription",
        },
      };
      user.isSubscribe = true;
      try {
        const { data } = (await instance(config)).data;

        user.subscription = data;
        handleSuccess("Payment Successful");
        onCloseModal();
        onClose();
        localStorage.setItem("userInfo", JSON.stringify(user));
        history.replace(`/${userType}/dashboard`);
      } catch (error) {
        console.error("Error making POST request:", error);
        handleError(error.message);
      }
    },
    onError: function () {
      handleError("Couldn't process payment");
    },
    onClose: function () {
      onOpen && onOpen();
    },
  };

  // REMITA METHOD ENDS --------------------------------------------------------------------------------

  useEffect(() => {
    setValue("amount", "2,000,000");
    setAmount(2000000);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onCloseModal = () => {
    onCloseSubscription();
    setPaymentMethod("");
    setIsPaystack(false);
    setLoading(false);
    reset();
    reOpen && reOpen();
  };

  return (
    <div>
      <BaseModal
        isOpen={isOpen}
        onClose={onCloseModal}
        title={"Subscription fee"}
        size="xl"
        subtitle={"Pay your subscription fee to gain full access"}
      >
        <Box>
          <Text mt="10px" mb="20px" color="#999999">
            Select a payment method
          </Text>

          <Center>
            <Grid
              templateRows="repeat(1, 1fr)"
              templateColumns="repeat(8, 1fr)"
              gap={5}
              mx={"auto"}
            >
              {paymentMethods.map((e, i) => (
                <GridItem height="123px" colSpan={4} key={i}>
                  <Center
                    rounded="8px"
                    cursor="pointer"
                    height="100%"
                    bg={e?.bg}
                    border={`3px solid ${
                      paymentMethod === e?.title && "#999999"
                    }`}
                    box-shadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
                    onClick={() => handlePaymentMethod(e?.title)}
                  >
                    <Image src={e?.url} alt={`payment method - ${e?.title}`} />
                  </Center>
                </GridItem>
              ))}
            </Grid>
          </Center>
        </Box>

        {(paymentMethod === "Paystack" || paymentMethod === "BankTransfer") && (
          <Text color="primary" fontWeight="600" textAlign="center" mt={5}>
            Transaction may take some minutes before it is confirmed.
          </Text>
        )}

        <Box fontSize="14px" mt="40px" mb="20px">
          <Box my={"10px"}>
            <Controller
              control={control}
              defaultValue=""
              name="amount"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    placeholder="1,000,000,000"
                    label="Amount"
                    isRequired
                    type={"text"}
                    value={value}
                    onChange={onChange}
                    isDisabled={true}
                  />
                  <div style={{ color: "red" }}>
                    {errors["amount"] ? errors["amount"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
        </Box>

        {paymentMethod === "Remita" ? (
          <Box
            m={"0"}
            onClick={() => {
              onClose && onClose();
              onCloseSubscription && onCloseSubscription();
              closeSidebar && closeSidebar();
            }}
          >
            <RemitaPayment
              remitaData={remitaData}
              className="btn remita-pay-button"
              style={{ width: "100%" }}
              text={"Fund Remita"}
            />
          </Box>
        ) : (
          <Button
            mb={10}
            isLoading={isLoading}
            full
            onClick={handleSubmit(onSubmit)}
            mr={3}
          >
            Fund
          </Button>
        )}
      </BaseModal>
    </div>
  );
};

export default PaymentSubscriptionModal;
