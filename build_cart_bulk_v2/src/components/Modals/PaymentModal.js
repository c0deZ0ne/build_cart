import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import Input from "../Input";
import Button from "../Button";
import BaseModal from "./Modal";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import instance from "../../utility/webservices";
import { handleError, handleSuccess } from "../../utility/helpers";
import BankTransfer from "../../assets/images/pay-transfer.svg";
import Paystack from "../../assets/images/pay-paystack2.svg";
import Remita from "../../assets/images/pay-remita2.svg";
import Bank from "../../assets/images/pay-bank.svg";
import MasterCard from "../../assets/images/pay-mastercard2.svg";
import { usePaystackPayment } from "react-paystack";
import Naira from "../Icons/Naira";
import { upperCase } from "lodash";

const PaymentModal = ({
  isOpen,
  onClose,
  useVault,
  title = "Fund Account",
  subtitle,
  refresh,
  callbackUrl = `builder/fund-account`,
  setVal,
  description = "Accout Funded",
}) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [userAccountInfo, setUserAccountInfo] = useState({});
  const [paystackConfig, setPaystackConfig] = useState({});
  const [amount, setAmount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isPaystack, setIsPaystack] = useState(false);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const initializePayment = usePaystackPayment(paystackConfig);

  const paymentMethods = [
    { title: "Remita", url: Remita, bg: "#F1652129" },
    { title: "Paystack", url: Paystack, bg: "#2DBDEF29" },
    { title: "BankTransfer", url: BankTransfer, bg: "#12355A29" },
    {
      title: "MasterCard",
      url: MasterCard,
      bg: "linear-gradient(180deg, #CC213129 0%, #E9B04029 100%)",
    },
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

  if (setVal) {
    setValue("amount", new Intl.NumberFormat().format(setVal));
  }

  const onSubmit = async (data) => {
    setLoading(true);
    const config = {
      amount: data?.amount * 100,
      email: user?.email,
      fullName: user?.userName,
      publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      metadata: {
        walletId: userAccountInfo?.id,
        account_number: userAccountInfo?.account_number,
      },
    };

    setAmount(data?.amount);
    if (paymentMethod === "Paystack") {
      setPaystackConfig(() => config);
      setIsPaystack(!isPaystack);
    } else if (paymentMethod === "Vault") {
      handlePaymentWithVault();
    } else {
      handleError("Payment method is not supported!");
      setLoading(false);
    }
  };

  // VAULT METHOD STARTS -----------------------------------------
  const handlePaymentWithVault = async () => {
    try {
      await instance.patch(callbackUrl);

      refresh();
      onClose();
      setLoading(false);
      handleSuccess("Payment successful");
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };
  // VAULT METHOD ENDS -----------------------------------------

  // PAYSTACK METHOD STARTS --------------------------------------

  const handleClosePaystackPayment = () => {
    // handleError("Payment Cancelled");
    reset();
    // onClose();
    setLoading(false);
  };

  const handlePaystackSuccessPayment = (responseData) => {
    const { reference, status } = responseData;
    let transactionStatus =
      status === "success"
        ? "COMPLETED"
        : status === "pending"
        ? "PENDING"
        : "FAILED";

    instance
      .post(callbackUrl, {
        ...responseData,
        account_number: user?.wallet?.account_number,
        description,
        paymentMethod: paymentMethod ?? "BANK_TRANSFER",
        transactionStatus,
        PaymentProvide: upperCase(paymentMethod),
        amount,
        ref: reference,
        pay_ref: reference,
        userId: user?.id,
      })
      .then((data) => {
        handleSuccess("Payment Successful");
        refresh && refresh();
      })
      .catch((err) => {
        handleError(err);
      });
    onClose();
  };

  useEffect(() => {
    setLoading(false);

    if (amount > 0) {
      initializePayment(
        handlePaystackSuccessPayment,
        handleClosePaystackPayment,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaystack]);

  // PAYSTACK METHOD ENDS --------------------------------------

  const getUserAccount = async () => {
    const { data } = (
      await instance.get(`/user/account-details?email=${user?.email}`)
    ).data;

    setUserAccountInfo(data?.wallet);
  };

  useEffect(() => {
    getUserAccount();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <div>
      <BaseModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setPaymentMethod("");
          setLoading(false);
        }}
        title={title}
        reset={setVal ? "" : reset}
        subtitle={subtitle}
      >
        <Box>
          {!useVault && (
            <>
              <Text my="20px" color="#999999">
                Fund With:
              </Text>
              <Grid
                templateRows="repeat(1, 1fr)"
                templateColumns="repeat(8, 1fr)"
                gap={5}
                mx={3}
              >
                {paymentMethods.map((e, i) => (
                  <GridItem height="123px" colSpan={2} key={i}>
                    <Center
                      rounded="8px"
                      cursor="pointer"
                      height="100%"
                      bg={e?.bg}
                      border={`2px solid ${
                        paymentMethod === e?.title && "#999999"
                      }`}
                      box-shadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
                      onClick={() => setPaymentMethod(e?.title)}
                    >
                      <Image
                        src={e?.url}
                        alt={`payment method - ${e?.title}`}
                      />
                    </Center>
                  </GridItem>
                ))}
              </Grid>
            </>
          )}
        </Box>
        {useVault && (
          <>
            <Box my={10} bg="secondary" w="100%" h="1px" />

            <Grid
              templateRows="repeat(1, 1fr)"
              templateColumns="repeat(8, 1fr)"
              gap={5}
              mx={3}
            >
              <GridItem colSpan={2}>
                <Center
                  cursor="pointer"
                  rounded="8px"
                  height="100%"
                  bg="#12355A29"
                  border={`2px solid ${paymentMethod === "Vault" && "#999999"}`}
                  box-shadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
                  onClick={() => setPaymentMethod("Vault")}
                >
                  <VStack gap={0}>
                    <Image
                      src={Bank}
                      alt={`payment method - vault`}
                      width="35px"
                    />
                    <Text mt="8px" lineHeight={"10px"}>
                      Fund From
                    </Text>
                    <Text fontWeight="600">Vault</Text>
                  </VStack>
                </Center>
              </GridItem>

              <GridItem colSpan={6}>
                <Box
                  bg="rgba(245, 133, 44, .08)"
                  width="100%"
                  rounded="8px"
                  p="30px"
                >
                  <Text mr="auto" fontSize="14px" fontWeight="600">
                    Account Balance
                  </Text>
                  <Flex
                    color="secondary"
                    alignItems="center"
                    fontSize="28px"
                    fontWeight="700"
                  >
                    {<Naira fill="#F5852C" />}{" "}
                    {new Intl.NumberFormat().format(
                      userAccountInfo?.totalCredit ?? 0,
                    )}
                  </Flex>
                </Box>
              </GridItem>
            </Grid>
          </>
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
                    type={setVal ? "text" : "number"}
                    value={value}
                    onChange={onChange}
                    isDisabled={setVal ? true : false}
                  />
                  <div style={{ color: "red" }}>
                    {errors["amount"] ? errors["amount"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
        </Box>

        <Button
          mb={10}
          isLoading={isLoading}
          full
          onClick={handleSubmit(onSubmit)}
          mr={3}
        >
          Fund
        </Button>
      </BaseModal>
    </div>
  );
};

export default PaymentModal;
