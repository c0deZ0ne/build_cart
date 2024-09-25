import React, { useEffect, useState } from "react";
import BaseModal from "../../../components/Modals/Modal";
import { Box, Text } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import instance from "../../../utility/webservices";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import useModalHandler from "../../../components/Modals/SuccessModal";
import { handleError } from "../../../utility/helpers";

const WithdrawFundsModal = ({ isOpen, onClose, setSuccess, isSuccess }) => {
  const { handleSuccessModal, ModalComponent } = useModalHandler();
  const [bankDetails, setBankDetails] = useState(true);
  const [canWithdraw, setCanWithdraw] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const schema = yup.object({
    amount: yup.string().required("Amount is required"),
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
    formState: { errors },
  } = methods;

  const onSubmit = async ({ amount }) => {
    setLoading(true);

    try {
      const payload = {
        Amount: amount,
        description: "Request withdrawal",
        proof_docs: [],
      };
      await instance.patch("/vendor/transaction/fund-withdrawal", payload);

      setLoading(false);
      handleSuccessModal("Withdrawal successful");
      onClose();
      reset();
      setSuccess(!isSuccess);
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };

  const getBankDetails = async () => {
    try {
      const { data } = (await instance.get("/vendor/account/bank")).data;

      if (data?.accountNumber) {
        setBankDetails(data);
        setCanWithdraw(true);
      } else {
        setCanWithdraw(false);
      }
    } catch (error) {
      setCanWithdraw(false);
      handleError(error);
    }
  };

  useEffect(() => {
    getBankDetails();
  }, []);

  return (
    <div>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        reset={reset}
        title="Withdraw Funds"
        subtitle="Make withdrawals into your business account"
        size="xl"
      >
        <Box my={"10px"} fontSize="14px">
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
                  type="number"
                  value={value}
                  onChange={onChange}
                />
                <div style={{ color: "red" }}>
                  {errors["amount"] ? errors["amount"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>

        {canWithdraw ? (
          <Box>
            <Text my={5}>Bank Name: {bankDetails?.bankName}</Text>
            <Text my={5}>Account Name: {bankDetails?.accountName}</Text>
            <Text my={5}>Account Number: {bankDetails?.accountNumber}</Text>
          </Box>
        ) : (
          <Text color="red" my={5} textAlign="center" fontSize="15px">
            You can't withdraw yet, kindly update your bank details in settings.
          </Text>
        )}

        <Button
          full
          onClick={handleSubmit(onSubmit)}
          isLoading={isLoading}
          disabled={!canWithdraw}
        >
          Withdraw
        </Button>
      </BaseModal>

      {ModalComponent}
    </div>
  );
};

export default WithdrawFundsModal;
