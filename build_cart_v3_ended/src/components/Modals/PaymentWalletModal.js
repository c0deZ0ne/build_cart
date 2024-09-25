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
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import instance from "../../utility/webservices";
import { handleError } from "../../utility/helpers";
import BankTransfer from "../../assets/images/pay-transfer.svg";
import Paystack from "../../assets/images/pay-paystack2.svg";
import Remita from "../../assets/images/pay-remita2.svg";
import Bank from "../../assets/images/pay-bank.svg";
import MasterCard from "../../assets/images/pay-mastercard2.svg";
import Naira from "../Icons/Naira";
import PaystackPayment from "../Payments/PayWithPaystack";
import {
  fundProjectWalletWithVault,
  fundOrder,
} from "../Payments/PayWithVault";
import PayWithRemita from "../Payments/PayWithRemita";

const PaymentWalletModal = ({
  isOpen,
  onClose,
  title = "Fund Account",
  refresh,
  subtitle,
  paymentPurpose,
  description,
  setVal,
  projectId,
  orderId,
  isFundManagerProject,
  useVault,
  useProjectWallet,
}) => {
  const [paymentMethod, setPaymentMethod] = useState(""); // Remita || Paystack || Project Wallet || BankTransfer || Vault
  const [userAccountInfo, setUserAccountInfo] = useState({});
  const [walletBalance, setWalletBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isPaystack, setPaystack] = useState(false);
  const [paystackChannels, setPaystackChannels] = useState([]); // ["bank_transfer"] || ["card", "bank", "ussd"]
  const [isPaymentMthd, setPaymentMthd] = useState(false);
  const user = JSON.parse(localStorage.getItem("userInfo"));

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

  const handlePaymentMethod = (mthd) => {
    setPaystack(false);

    setPaymentMethod(mthd);
  };

  const onSubmit = async (data) => {
    try {
      setAmount(Number(data?.amount.replaceAll(",", "")));
      setPaymentMthd(!isPaymentMthd);

      if (paymentMethod === "") {
        return handleError("Select a payment method!");
      } else if (paymentMethod === "Paystack") {
        setPaystack(true);
        setPaystackChannels(["card", "bank", "ussd"]);
      } else if (paymentMethod === "BankTransfer") {
        setPaystack(true);
        setPaystackChannels(["bank_transfer"]);
      } else if (
        paymentMethod === "Project Wallet" &&
        paymentPurpose === "FUND_ORDER"
      ) {
        setLoading(false);
        return fundOrder(
          Number(data?.amount),
          orderId,
          setLoading,
          onCloseModal,
          refresh,
          "projectWallet",
        );
      } else if (paymentMethod === "Vault") {
        if (orderId && paymentPurpose === "FUND_ORDER") {
          return fundOrder(
            Number(data?.amount),
            orderId,
            setLoading,
            onCloseModal,
            refresh,
            "vault",
          );
        } else {
          return fundProjectWalletWithVault(
            Number(data?.amount),
            projectId,
            setLoading,
            onCloseModal,
            refresh,
          );
        }
      } else {
        setLoading(false);
        return handleError("Payment method is not supported!");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

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

  const getProjectWalletDetails = async () => {
    try {
      const { data } = (await instance.get(`/projects/wallet/${projectId}`))
        .data;

      setWalletBalance(data?.balance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getUserAccount();
      orderId && paymentPurpose === "FUND_ORDER" && getProjectWalletDetails();

      setValue("amount", new Intl.NumberFormat().format(setVal));
      setAmount(Number(setVal));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const watchedValue = useWatch({
    control,
    name: "amount", // Replace 'fieldName' with the name of the field you want to watch
  });

  useEffect(() => {
    setAmount(Number(watchedValue));
  }, [watchedValue]);

  const onCloseModal = () => {
    onClose();
    setPaymentMethod("");
    setPaystack(false);
    setLoading(false);
    reset();
  };

  return (
    <div>
      <BaseModal
        isOpen={isOpen}
        onClose={onCloseModal}
        title={title}
        reset={setVal ? "" : reset}
        subtitle={subtitle}
      >
        <Box>
          <Text mt="10px" mb="20px" color="#999999">
            Select a payment method or fund from vault
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
        </Box>

        {(paymentMethod === "Paystack" || paymentMethod === "BankTransfer") && (
          <Text color="primary" fontWeight="600" textAlign="center" mt={5}>
            Transaction may take some minutes before it is confirmed (Refresh
            after 1 min).
          </Text>
        )}

        <>
          <Box my={10} bg="secondary" w="100%" h="1px" />
          {orderId && paymentPurpose === "FUND_ORDER" && useProjectWallet && (
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
                  border={`3px solid ${
                    paymentMethod === "Project Wallet" && "#999999"
                  }`}
                  box-shadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
                  onClick={() => handlePaymentMethod("Project Wallet")}
                >
                  <VStack gap={0}>
                    <Image
                      src={Bank}
                      alt={`payment method - Project Wallet`}
                      width="35px"
                    />
                    <Text mt="8px" lineHeight={"10px"}>
                      Fund From
                    </Text>
                    <Text fontWeight="600">Project Wallet</Text>
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
                    Project Wallet Account Balance
                  </Text>
                  <Flex
                    color="secondary"
                    alignItems="center"
                    fontSize="28px"
                    fontWeight="700"
                  >
                    {<Naira fill="#F5852C" />}{" "}
                    {new Intl.NumberFormat().format(walletBalance ?? 0)}
                  </Flex>
                </Box>
              </GridItem>
            </Grid>
          )}

          {isFundManagerProject && paymentPurpose === "FUND_ORDER"
            ? ""
            : useVault && (
                <Grid
                  templateRows="repeat(1, 1fr)"
                  templateColumns="repeat(8, 1fr)"
                  gap={5}
                  mx={3}
                  mt={5}
                >
                  <GridItem colSpan={2}>
                    <Center
                      cursor="pointer"
                      rounded="8px"
                      height="100%"
                      bg="#12355A29"
                      border={`3px solid ${
                        paymentMethod === "Vault" && "#999999"
                      }`}
                      box-shadow="0px 0px 8px 1px rgba(18, 53, 90, 0.04)"
                      onClick={() => handlePaymentMethod("Vault")}
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
                          userAccountInfo?.balance ?? 0,
                        )}
                      </Flex>
                    </Box>
                  </GridItem>
                </Grid>
              )}
        </>
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

        {paymentMethod === "Remita" && amount ? (
          <PayWithRemita
            amount={amount}
            onClose={onClose}
            refresh={refresh}
            orderId={orderId}
            projectId={projectId}
            description={description}
            paymentPurpose={paymentPurpose}
            vaultId={userAccountInfo?.id}
          />
        ) : (
          <Button
            mb={10}
            mr={3}
            full
            isLoading={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Fund
          </Button>
        )}
      </BaseModal>

      {isPaystack && (
        <PaystackPayment
          amount={amount}
          refresh={refresh}
          orderId={orderId}
          projectId={projectId}
          setLoading={setLoading}
          onCloseModal={onCloseModal}
          channels={paystackChannels}
          isPaymentMthd={isPaymentMthd}
          paymentPurpose={paymentPurpose} // FUND_PROJECT_WALLET,FUND_WALLET,FUND_ORDER
        />
      )}
    </div>
  );
};

export default PaymentWalletModal;
