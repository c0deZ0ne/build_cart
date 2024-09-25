import { Box, Text, Heading, Flex } from "@chakra-ui/react";
import React from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomSelect from "../../components/CustomSelect/CustomSelect";

const VendorBusinessInfo = ({ setActiveStep }) => {
  const sizeOptions = [
    { value: "MICRO", label: "Micro enterprises: 1 to 9 employees." },
    { value: "SMALL", label: "Small enterprises: 10 to 49 employees." },
    {
      value: "MEDIUM",
      label: "Medium-sized enterprises: 50 to 249 employees.",
    },
    { value: "LARGE", label: "Large enterprises: 250 employees or more" },
  ];

  const schema = yup.object({
    businessAddress: yup.string().required("Business name is required"),
    businessRegNo: yup.string().required("Registration number is required"),
    size: yup.object().required("Business size is required"),
  });

  const methods = useForm({
    defaultValues: {
      businessRegNo: "",
      businessAddress: "",
    },
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    setActiveStep(2);

    const storedData = JSON.parse(localStorage.getItem("vendorData"));

    const updatedDataString = JSON.stringify({
      ...storedData,
      ...data,
    });

    localStorage.setItem("vendorData", updatedDataString);
  };

  return (
    <div>
      <Box textAlign="center">
        <Heading color="#F5862E" m="20px 0 10px" fontSize={"24px"}>
          Business Information
        </Heading>
        <Text color="#999999" fontSize="14px" mb="20px">
          To get the best out of cutstruct, add your business information.
        </Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box fontSize="14px" mt="30px" mb="30px">
          <Box my={"20px"}>
            <Text>
              Business Address<span style={{ color: "red" }}>*</span>
            </Text>
            <Controller
              control={control}
              name="businessAddress"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    placeholder="Business Address"
                    value={value}
                    onChange={onChange}
                    p="22px 10px"
                  />
                  <div style={{ color: "red" }}>
                    {errors["businessAddress"]
                      ? errors["businessAddress"]?.message
                      : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
          <Box my={"20px"}>
            <Text>
              Business Registration Number
              <span style={{ color: "red" }}>*</span>
            </Text>
            <Controller
              control={control}
              name="businessRegNo"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    placeholder="RN-6547382910"
                    value={value}
                    onChange={onChange}
                    p="22px 10px"
                  />
                  <div style={{ color: "red" }}>
                    {errors["businessRegNo"]
                      ? errors["businessRegNo"]?.message
                      : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
          <Box my={"20px"}>
            <Text>
              Business Size
              <span style={{ color: "red" }}>*</span>
            </Text>

            <Controller
              control={control}
              name="size"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
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
        </Box>

        <Flex justify="space-between" alignItems="center">
          <Text
            onClick={() => setActiveStep(2)}
            cursor="pointer"
            fontSize="15px"
            fontWeight="600"
          >
            Skip
          </Text>
          <Button isSubmit width="200px">
            Save & Continue
          </Button>
        </Flex>
      </form>
    </div>
  );
};

export default VendorBusinessInfo;
