import { Box, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function BusinessDetailsView() {
  const schema = yup.object({
    businessAddress: yup.string().required("Business Address is required"),
    businessRegNo: yup
      .string()
      .required("Business registration number is required"),
    size: yup.object().required("Business size is required"),
  });

  const useFormData = useForm({
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormData;

  const submitForm = (data) => {
    // console.log(data);
  };

  const sizeOptions = [
    { value: "MICRO", label: "Micro enterprises: 1 to 9 employees." },
    { value: "SMALL", label: "Small enterprises: 10 to 49 employees." },
    {
      value: "MEDIUM",
      label: "Medium-sized enterprises: 50 to 249 employees.",
    },
    { value: "LARGE", label: "Large enterprises: 250 employees or more" },
  ];

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

      <Box w={{ lg: "66.8%", sm: "100%" }}>
        <Box spacing="24px" mt="24px">
          <Controller
            control={control}
            name="businessAddress"
            render={({ field: { onChange, value } }) => (
              <Box mb="10px">
                <Input
                  name="businessAddress"
                  label="Business Address"
                  isRequired
                  value={value}
                  onChange={onChange}
                />
                <div style={{ color: "red", fontSize: "14px" }}>
                  {errors["businessAddress"]
                    ? errors["businessAddress"]?.message
                    : ""}
                </div>
              </Box>
            )}
          />
          <Controller
            control={control}
            name="businessRegNo"
            render={({ field: { onChange, value } }) => (
              <Box mb="10px">
                <Input
                  name="businessRegNo"
                  label="Business Registration Number"
                  isRequired
                  value={value}
                  onChange={onChange}
                />
                <div style={{ color: "red", fontSize: "14px" }}>
                  {errors["businessRegNo"]
                    ? errors["businessRegNo"]?.message
                    : ""}
                </div>
              </Box>
            )}
          />

          <Controller
            control={control}
            name="size"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Text fontSize="12px">
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
                  {errors["size"] ? errors["size"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>

        {/* <VStack align="start" mt="62px">
                    <Text fontWeight="600" color="secondary">Business Account Information</Text>
                    <Text fontSize="12px" color="primary">You can update and edit your business documents</Text>
                </VStack>

                <VStack spacing="24px" mt="40px">
                    <Controller
                        control={control}
                        name="bankName"
                        render={({field: {onChange, value}}) => (
                            <Input
                                name="bankName"
                                label="Bank Name"
                                isRequired
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="bankAccountName"
                        render={({field: {onChange, value}}) => (
                            <Input
                                name="bankAccountName"
                                label="Bank Account Name"
                                isRequired
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="bankAccountNumber"
                        render={({field: {onChange, value}}) => (
                            <Input
                                name="bankAccountNumber"
                                label="Bank Account Number"
                                isRequired
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </VStack> */}

        <Box mt="60px">
          <Button
            full
            isSubmit
            isLoading={false}
            onClick={handleSubmit(submitForm)}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
