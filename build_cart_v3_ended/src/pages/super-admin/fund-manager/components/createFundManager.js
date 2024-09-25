import React, { useEffect, useState } from "react";
import BaseModal from "../../../../components/Modals/Modal";
import { Box, Flex, FormLabel } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import Input, { InputPhone } from "../../../../components/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../../../components/Button";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import {
  useCreateFundManagerMutation,
  useUpdateFundManagerMutation,
} from "../../../../redux/api/super-admin/fundManagerSlice";
import { handleError } from "../../../../utility/helpers";
import SuccessMessage from "../../../../components/SuccessMessage";

export default function CreateFundManager({ refetch, isOpen, onClose }) {
  const [openFundManagerBusiness, setOpenFundManagerBusiness] = useState(false);
  const [newFundManager, setNewFundManager] = useState(null);
  const [creationSuccessful, setCreationSuccessful] = useState(false);

  const createFundManagerSchema = yup.object({
    businessName: yup.string().required("Business name is required"),
    name: yup.string().required("Contact person name is required"),
    phone: yup.string().required("Phone is required"),
    email: yup.string().required("Email is required").email(),
  });

  const createFundManagerBusinessSchema = yup.object({
    businessAddress: yup.string().required("Business address is required"),
    businessRegNo: yup
      .string()
      .required("Business registration number is required"),
    businessSize: yup.object().required("Business size is required"),
  });

  const sizeOptions = [
    { value: "MICRO", label: "Micro enterprises: 1 to 9 employees." },
    { value: "SMALL", label: "Small enterprises: 10 to 49 employees." },
    {
      value: "MEDIUM",
      label: "Medium-sized enterprises: 50 to 249 employees.",
    },
    { value: "LARGE", label: "Large enterprises: 250 employees or more" },
  ];

  const methods = useForm({
    defaultValues: {
      businessName: "",
      name: "",
      phone: "",
      email: "",
    },
    resolver: yupResolver(createFundManagerSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const businessInfoMethods = useForm({
    defaultValues: {
      businessAddress: "",
      businessRegNo: "",
      businessSize: "",
    },
    resolver: yupResolver(createFundManagerBusinessSchema),
  });

  const {
    control: businessInfoControl,
    handleSubmit: handleSubmitBusinessInfo,
    formState: { errors: businessInfoErrors },
  } = businessInfoMethods;

  const [
    createFundManager,
    {
      isLoading: createLoading,
      isSuccess: createSuccess,
      error: createError,
      isError: createIsError,
      data: createReponse,
    },
  ] = useCreateFundManagerMutation();

  const [
    updateFundManager,
    {
      isLoading: updateLoading,
      isSuccess: updateSuccess,
      error: updateError,
      isError: updateIsError,
    },
  ] = useUpdateFundManagerMutation();

  const submitCreation = (data) => {
    createFundManager(data);
  };

  useEffect(() => {
    if (createSuccess) {
      setNewFundManager(createReponse?.dataValues);
      setCreationSuccessful(true);
      setTimeout(() => {
        setCreationSuccessful(false);
        setOpenFundManagerBusiness(true);
        onClose();
        reset();
      }, 2000);
    }
    if (createIsError) {
      handleError(createError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createLoading]);

  const submitBusinessInfo = (data) => {
    if (newFundManager) {
      updateFundManager({
        payload: {
          ...data,
          businessSize: data.businessSize.value,
        },
        id: newFundManager.FundManagerId,
      });
    }
  };

  useEffect(() => {
    if (updateSuccess) {
      refetch();
    }
    if (updateIsError) {
      handleError(updateError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createLoading]);

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          reset();
          setCreationSuccessful(false);
        }}
        title="Create Fund Manager"
        subtitle="Create Fund Manager"
      >
        {creationSuccessful ? (
          <SuccessMessage message="Fund Manager created and invited successfully." />
        ) : (
          <form onSubmit={handleSubmit(submitCreation)}>
            <Box mb={"24px"}>
              <Controller
                control={control}
                defaultValue=""
                name="businessName"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <Input
                      placeholder="Business Name"
                      label="Business Name"
                      value={value}
                      onChange={onChange}
                      isRequired
                    />
                    <div style={{ color: "red" }}>
                      {errors["businessName"]
                        ? errors["businessName"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>
            <Box mb={"24px"}>
              <Controller
                control={control}
                defaultValue=""
                name="name"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <Input
                      placeholder="John Jameson"
                      label="Full Name (Business Contact Person)"
                      value={value}
                      onChange={onChange}
                      isRequired
                    />
                    <div style={{ color: "red" }}>
                      {errors["name"] ? errors["name"]?.message : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Box mb={"24px"}>
              <Controller
                control={control}
                defaultValue=""
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <Input
                      placeholder="mail@mail.com"
                      label="Email (Business Contact Person)"
                      value={value}
                      onChange={onChange}
                      isRequired
                    />
                    <div style={{ color: "red" }}>
                      {errors["email"] ? errors["email"]?.message : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Box mb="40px">
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <Flex direction="column">
                      <FormLabel mb="8px" fontSize="14px" fontWeight="400">
                        Phone Number (Business Contact Person){" "}
                        <span style={{ color: "red" }}>*</span>
                      </FormLabel>
                      <InputPhone
                        name="phone"
                        value={value}
                        onChange={onChange}
                      />
                    </Flex>
                    <div style={{ color: "red" }}>
                      {errors["phone"] ? errors["phone"]?.message : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Button full isSubmit isLoading={createLoading}>
              Create
            </Button>
          </form>
        )}
      </BaseModal>

      <BaseModal
        isOpen={openFundManagerBusiness}
        onClose={() => setOpenFundManagerBusiness(false)}
        title="Fund Manager Business Information"
        subtitle="Enter fund manager’s business information."
      >
        {updateSuccess ? (
          <SuccessMessage
            message="Fund Manager’s business information 
          added successfully."
          />
        ) : (
          <form onSubmit={handleSubmitBusinessInfo(submitBusinessInfo)}>
            <Box mb={"24px"}>
              <Controller
                control={businessInfoControl}
                defaultValue=""
                name="businessAddress"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <Input
                      placeholder="Business Address"
                      label="Business Address"
                      value={value}
                      onChange={onChange}
                      isRequired
                    />
                    <div style={{ color: "red" }}>
                      {businessInfoErrors["businessAddress"]
                        ? businessInfoErrors["businessAddress"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Box mb={"24px"}>
              <Controller
                control={businessInfoControl}
                defaultValue=""
                name="businessRegNo"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <Input
                      placeholder="Business Registration Number"
                      label="Business Registration Number"
                      value={value}
                      onChange={onChange}
                      isRequired
                    />
                    <div style={{ color: "red" }}>
                      {businessInfoErrors["businessRegNo"]
                        ? businessInfoErrors["businessRegNo"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>

            <Box mb={"24px"}>
              <Controller
                control={businessInfoControl}
                name="businessSize"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <FormLabel
                      mb="0"
                      textTransform="capitalize"
                      fontWeight="400"
                      fontSize="14px"
                    >
                      Business Size
                      <span style={{ color: "red" }}>*</span>
                    </FormLabel>
                    <CustomSelect
                      placeholder="Business size"
                      options={sizeOptions}
                      value={value}
                      onChange={onChange}
                    />
                    <div style={{ color: "red", fontSize: "14px" }}>
                      {businessInfoErrors["businessSize"]
                        ? businessInfoErrors["businessSize"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>
            <Button full isSubmit isLoading={updateLoading}>
              Update Information
            </Button>
          </form>
        )}
      </BaseModal>
    </>
  );
}
