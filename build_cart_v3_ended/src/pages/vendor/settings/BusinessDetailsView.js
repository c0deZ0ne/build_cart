import { Box, Flex, Text, VStack, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import InputUploadFile from "../../../components/InputUploadFile";
import { uploadImage } from "../../../utility/queries";
import {
  useGetAccountNameMutation,
  useGetBnakQuery,
  useUpdateProfileDetailsMutation,
  useSaveBankDetailsMutation,
  useGetUserBankDetailsQuery,
} from "../../../redux/api/vendor/settingsApiService";
import { handleError, handleSuccess } from "../../../utility/helpers";

export default function BusinessDetailsView({
  profileDetails,
  isLoading,
  refetch,
}) {
  const toast = useToast();

  const [certificateOfIncorporation, setCertificateOfIncorporation] =
    useState(null);
  const [
    certificateOfIncorporationPlaceholder,
    setCertificateOfIncorporationPlaceholder,
  ] = useState("Cerificate of incorporation");
  const [certificateOfLocation, setCertificateOfLocation] = useState(null);
  const [
    certificateOfLocationPlaceholder,
    setCertificateOfLocationPlaceholder,
  ] = useState("Certificate of Location");
  const [UtilityBill, setUtilityBill] = useState(null);
  const [UtilityBillPlaceholder, setUtilityBillPlaceholder] =
    useState("Utility Bill");

  const [bankList, setBankList] = useState([]);
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const [
    updateProfileDetails,
    { isLoading: isSaving, isSuccess, isError, error },
  ] = useUpdateProfileDetailsMutation();

  const useFormData = useForm({
    defaultValues: {},
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useFormData;

  const submitForm = async (data) => {
    let certificateOfIncorporationUrl =
      profileDetails?.vendorProfile?.certificateOfIncorporation ?? null;
    let UtilityBillUrl = profileDetails?.vendorProfile?.UtilityBill ?? null;
    let certificateOfLocationUrl =
      profileDetails.vendorProfile?.certificateOfLocation ?? null;
    if (UtilityBill) {
      ({ url: UtilityBillUrl } = await uploadImage(
        UtilityBill,
        "image",
        false
      ));
    }
    if (certificateOfIncorporation) {
      ({ url: certificateOfIncorporationUrl } = await uploadImage(
        certificateOfIncorporation,
        "image",
        false
      ));
    }
    if (certificateOfLocation) {
      ({ url: certificateOfLocationUrl } = await uploadImage(
        certificateOfLocation,
        "image",
        false
      ));
    }
    const payload = {
      businessAddress: data.businessAddress,
      businessSize: data.businessSize.value,
      businessRegNo: data.businessRegNo,
      certificateOfLocation: certificateOfLocationUrl,
      certificateOfIncorporation: certificateOfIncorporationUrl,
      UtilityBill: UtilityBillUrl,
    };

    updateProfileDetails(payload);
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        status: "success",
        position: "top",
        description: "Information Saved...",
      });
      refetch();
    }
    if (isError) {
      handleError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving]);

  const sizeOptions = [
    { value: "MICRO", label: "Micro enterprises: 1 to 9 employees." },
    { value: "SMALL", label: "Small enterprises: 10 to 49 employees." },
    {
      value: "MEDIUM",
      label: "Medium-sized enterprises: 50 to 249 employees.",
    },
    { value: "LARGE", label: "Large enterprises: 250 employees or more" },
  ];

  useEffect(() => {
    if (profileDetails) {
      setValue(
        "businessAddress",
        profileDetails?.vendorProfile?.businessAddress
      );
      setValue(
        "businessSize",
        sizeOptions.find(
          (options) =>
            profileDetails?.vendorProfile?.businessSize === options.value
        )
      );
      setValue("businessRegNo", profileDetails?.vendorProfile?.businessRegNo);
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
      toast({
        description: handleError(getAccountNameError),
        status: "error",
        position: "top-right",
      });
    }

    if (response) {
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
        <Text fontSize="12px" color="primary">
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

        <VStack align="start" mt="62px" mb="24px">
          <Text fontWeight="600" color="secondary">
            Business Documents
          </Text>
          <Text fontSize="12px" color="primary">
            You can update and edit your business documents.
          </Text>
        </VStack>

        <Box w="100%">
          <Flex
            w="100%"
            gap="30px"
            wrap={{ base: "wrap", md: "nowrap" }}
            mb="30px"
          >
            <Box w="100%">
              <Text
                mb="0"
                textTransform="capitalize"
                fontWeight="400"
                fontSize="14px"
              >
                Cerificate of incorporation
              </Text>
              <InputUploadFile
                randomImgKey={Math.random()}
                image={certificateOfIncorporation}
                setImagePlaceholder={setCertificateOfIncorporationPlaceholder}
                setImage={setCertificateOfIncorporation}
                imagePlaceholder={certificateOfIncorporationPlaceholder}
              />
            </Box>
            <Box w="100%">
              <Text
                mb="0"
                textTransform="capitalize"
                fontWeight="400"
                fontSize="14px"
              >
                Cerificate of location
              </Text>
              <InputUploadFile
                randomImgKey={Math.random()}
                image={certificateOfLocation}
                setImagePlaceholder={setCertificateOfLocationPlaceholder}
                setImage={setCertificateOfLocation}
                imagePlaceholder={certificateOfLocationPlaceholder}
              />
            </Box>
          </Flex>
          <Flex w="100%" gap="30px" wrap={{ base: "wrap", md: "nowrap" }}>
            <Box w="100%">
              <Text
                mb="0"
                textTransform="capitalize"
                fontWeight="400"
                fontSize="14px"
              >
                Utility Bill
              </Text>
              <InputUploadFile
                randomImgKey={Math.random()}
                image={UtilityBill}
                setImagePlaceholder={setUtilityBillPlaceholder}
                setImage={setUtilityBill}
                imagePlaceholder={UtilityBillPlaceholder}
              />
            </Box>
            <Box w="100%"></Box>
          </Flex>
        </Box>
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
          <Button full isSubmit isLoading={isSaving}>
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
