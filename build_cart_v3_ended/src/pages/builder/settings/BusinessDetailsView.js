import { Box, Text, VStack, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import {
  useGetAccountNameMutation,
  useGetBnakQuery,
  useGetUserBankDetailsQuery,
} from "../../../redux/api/vendor/settingsApiService";
import { handleError, handleSuccess } from "../../../utility/helpers";
import { useUpdateProfileDetailsMutation } from "../../../redux/api/builder/settingsApiService";
import { useSaveBankDetailsMutation } from "../../../redux/api/builder/builder";

export default function BusinessDetailsView({ profileDetails, refetch }) {
  const toast = useToast();
  const [bankList, setBankList] = useState([]);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const sizeOptions = [
    { value: "MICRO", label: "Micro enterprises: 1 to 9 employees." },
    { value: "SMALL", label: "Small enterprises: 10 to 49 employees." },
    {
      value: "MEDIUM",
      label: "Medium-sized enterprises: 50 to 249 employees.",
    },
    { value: "LARGE", label: "Large enterprises: 250 employees or more" },
  ];

  const [
    updateProfileDetails,
    {
      isLoading: isSaving,
      isSuccess: savedSuccessfully,
      isError: isSavingHasError,
      error: savingError,
    },
  ] = useUpdateProfileDetailsMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const submitForm = async (data) => {
    const payload = {
      businessAddress: data.businessAddress,
      businessSize: data.businessSize.value,
      businessRegNo: data.businessRegNo,
    };

    updateProfileDetails(payload);
  };

  useEffect(() => {
    if (savedSuccessfully) {
      handleSuccess("Information Saved...");
      refetch();
    }
    if (isSavingHasError) {
      handleError(savingError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving]);

  useEffect(() => {
    if (profileDetails) {
      setValue(
        "businessAddress",
        profileDetails?.builderProfile?.Builder?.businessAddress
      );
      setValue(
        "businessSize",
        sizeOptions.find(
          (options) =>
            profileDetails?.builderProfile?.Builder?.businessSize ===
            options.value
        )
      );
      setValue(
        "businessRegNo",
        profileDetails?.builderProfile?.Builder?.businessRegNo
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileDetails]);

  const { data: banks } = useGetBnakQuery();

  useEffect(() => {
    if (banks?.data?.length > 0) {
      const listBank = banks?.data?.map((bank) => {
        return {
          value: bank.code,
          label: bank.name,
          slug: bank.slug,
        };
      });
      setBankList(listBank);
    }
  }, [banks]);

  const addBank = (e) => {
    e.preventDefault();
    if (bankName && accountNumber && accountName) {
      saveBankDetails({
        accountName: accountName,
        accountNumber: accountNumber,
        bankName: bankName.label,
        bankCode: bankName.value,
        bankSlug: bankName.slug,
      });
    }
  };

  const [
    getAccountName,
    {
      data: response,
      isLoading: getAccountNameLoading,
      isSuccess: getAccountNameSuccess,
      error: getAccountNameError,
      isError: getAccountNameIsError,
    },
  ] = useGetAccountNameMutation();

  const { data: userBankDetails, refetch: userBankDetailsRefetch } =
    useGetUserBankDetailsQuery();

  const [
    saveBankDetails,
    {
      isLoading: saveBankLoading,
      isSuccess: saveBankSuccess,
      error: saveBankError,
      isError: saveBankIsError,
    },
  ] = useSaveBankDetailsMutation();

  useEffect(() => {
    if (bankName && accountNumber.length >= 10) {
      getAccountName({
        accountNumber: accountNumber,
        bankCode: bankName.value,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankName, accountNumber]);

  useEffect(() => {
    if (getAccountNameIsError) {
      handleError(getAccountNameError);
    }

    if (getAccountNameSuccess && response) {
      setAccountName(response?.data?.account_name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAccountNameLoading, response]);

  useEffect(() => {
    if (saveBankSuccess) {
      userBankDetailsRefetch();
      handleSuccess("Bank details updated successfully");
    }
    if (saveBankIsError) {
      handleError(saveBankError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveBankLoading]);

  useEffect(() => {
    if (userBankDetails) {
      setAccountName(userBankDetails.data.accountName);
      setAccountNumber(userBankDetails.data.accountNumber);
      setBankName(
        bankList.find((list) => list.value === userBankDetails.data.bankCode)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userBankDetails]);
  return (
    <Box bg="white" p="24px" borderRadius="8px">
      <VStack align="start">
        <Text fontWeight="600" color="secondary">
          Business Information
        </Text>
        <Text fontSize="14px" color="primary">
          You can update and edit your business details
        </Text>
      </VStack>

      <Box
        w={{ lg: "66.8%", sm: "100%" }}
        as="form"
        onSubmit={handleSubmit(submitForm)}
      >
        <VStack spacing="24px" mt="24px">
          <Controller
            control={control}
            name="businessAddress"
            render={({ field: { onChange, value } }) => (
              <Input
                name="businessAddress"
                label="Business Address"
                isRequired
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="businessRegNo"
            render={({ field: { onChange, value } }) => (
              <Input
                name="businessRegNo"
                label="Business Registration Number"
                isRequired
                value={value}
                onChange={onChange}
              />
            )}
          />

          <Controller
            control={control}
            name="businessSize"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Text
                  mb="0"
                  textTransform="capitalize"
                  fontWeight="400"
                  fontSize="14px"
                >
                  Business Size
                  <span style={{ color: "red" }}>*</span>
                </Text>
                <CustomSelect
                  placeholder="Business size"
                  options={sizeOptions}
                  value={value}
                  onChange={onChange}
                />
                <div style={{ color: "red", fontSize: "14px" }}>
                  {errors["businessSize"]
                    ? errors["businessSize"]?.message
                    : ""}
                </div>
              </Box>
            )}
          />
        </VStack>

        <Box mt="60px">
          <Button full isSubmit isLoading={isSaving}>
            Save
          </Button>
        </Box>
      </Box>

      <VStack spacing="24px" mt="40px"></VStack>

      <Box
        as="form"
        w={{ lg: "66.8%", sm: "100%" }}
        onSubmit={(e) => addBank(e)}
      >
        <VStack align="start" mt="62px">
          <Text fontWeight="600" color="secondary">
            Business Account Information
          </Text>
          <Text fontSize="12px" color="primary">
            You can update and edit your business documents
          </Text>
        </VStack>

        <VStack spacing="24px" mt="40px">
          <Box w="100%">
            <Text
              mb="0"
              textTransform="capitalize"
              fontWeight="400"
              fontSize="14px"
            >
              Bank Name
            </Text>
            <CustomSelect
              placeholder="Bank Name"
              onChange={setBankName}
              value={bankName}
              options={bankList}
            />
          </Box>
          <Input
            name="bankAccountNumber"
            label="Bank Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
          />
          <Input
            name="bankAccountName"
            label="Bank Account Name"
            value={accountName}
            isDisabled
          />
        </VStack>
        <Box mt="60px">
          <Button full isSubmit isLoading={saveBankLoading}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
