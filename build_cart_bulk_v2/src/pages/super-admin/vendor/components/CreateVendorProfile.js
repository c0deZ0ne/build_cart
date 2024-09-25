import { Box, Text, Heading, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Button from "../../../../components/Button";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import SERVICES from "../../../../utility/webservices";
import instance from "../../../../utility/webservices";
import { handleError } from "../../../../utility/helpers";

const CreateVendorProfile = ({
  vendorId,
  setSuccess,
  vendorProfile,
  setVendorProfile,
  profileSuccess,
}) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const vendorOptions = [
    { value: "MANUFACTURER", label: "Manufacturer" },
    { value: "DISTRIBUTOR", label: "Distributor" },
  ];

  const schema = yup.object({
    categories: yup
      .array()
      .of(yup.object())
      .min(1, "You must select at least one category")
      .required("Category is required"),
    vendorType: yup.object().required("Supplier type is required"),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const submitCategory = async (data) => {
    const payload = {
      RfqCategories: data?.categories.map((id) => {
        return id.value;
      }),
    };
    try {
      const response = await instance.patch(
        `/superAdmin/vendors/${vendorId}/category`,
        payload,
      );
      console.log(response);
    } catch (error) {
      handleError(error);
      console.log(error);
    }
  };

  const submitType = async (data) => {
    setIsLoading(true);

    const payload = {
      vendorType: data?.vendorType?.value,
    };
    try {
      const response = await instance.patch(
        `/superAdmin/vendors/${vendorId}/profile`,
        payload,
      );
      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = (data) => {
    Promise.all([submitCategory(data), submitType(data)]);
  };

  const getCategories = async () => {
    const { data } = (await SERVICES.get("/category?page_size=1000")).data;
    const catArr = data.map((e, i) => {
      return { value: e.id, label: e.title };
    });
    setCategories(catArr);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <Box textAlign="center">
        <Heading color="#F5862E" m="20px 0 10px" fontSize={"24px"}>
          Supplier Category
        </Heading>
        <Text color="#999999" fontSize="14px" mb="20px">
          To get the best out of cutstruct, add your business information.
        </Text>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box fontSize="14px" mt="30px" mb="30px">
          <Box my={"20px"}>
            <Text>
              Supplier Type
              <span style={{ color: "red" }}>*</span>
            </Text>

            <Controller
              control={control}
              name="vendorType"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <CustomSelect
                    placeholder="Supplier type"
                    options={vendorOptions}
                    value={value}
                    onChange={onChange}
                  />
                  <div style={{ color: "red", fontSize: "14px" }}>
                    {errors["vendorType"] ? errors["vendorType"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>

          <Box my={"20px"}>
            <Text>
              Category (You can select multiple categories)
              <span style={{ color: "red" }}>*</span>
            </Text>
            <Controller
              control={control}
              name="categories"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <CustomSelect
                    value={value}
                    isMulti
                    onChange={onChange}
                    options={categories}
                    placeholder="Select a category"
                  />
                  <div style={{ color: "red" }}>
                    {errors["categories"] ? errors["categories"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
        </Box>

        <Button full isSubmit isLoading={isLoading}>
          Save
        </Button>
      </form>
    </div>
  );
};

export default CreateVendorProfile;
