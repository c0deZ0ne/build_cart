import React, { useEffect, useState } from "react";
import Button from "../../../../components/Button";
import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import Input from "../../../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import instance from "../../../../utility/webservices";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import Naira from "../../../../components/Icons/Naira";
import BaseModal from "../../../../components/Modals/Modal";
import RfqScheduledDelivery from "./rfqScheduledDelivery";
import { fetchStates } from "../../../../utility/queries";

const CreateRfq = ({ onclose, materialList, setDefaultIndex }) => {
  const [categories, setCategories] = useState([]);
  const [states, setStates] = useState([]);
  const [rfqData, setRfqData] = useState({});
  const schema = yup.object({
    name: yup.string().required("Material Name is required"),
    materialSchedule: yup.string().required("Material Schedule is required"),
    description: yup.string().required("Description is required"),
    quantity: yup.string().required("Quantity is required"),
    measurement: yup.string().required("Measurement is required"),
    budget: yup.string().required("Budget is required"),
    deliveryAddress: yup.string().required("Delivery Address is required"),
    deliveryDate: yup.string().required("Delivery Date is required"),
    category: yup.object().required("Category is required"),
    state: yup.object().required("State is required"),
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const defaultValues = {
    name: "",
    materialSchedule: "",
    description: "",
    quantity: "",
    measurement: "",
    budget: "",
    deliveryAddress: "",
    deliveryDate: "",
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (materialList) {
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, materialList[key]);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  const onSubmit = async (data) => {
    setRfqData(data);
    onOpen();
  };

  const getCategories = async () => {
    const { data } = (await instance.get("/category?page_size=1000")).data;

    const catArr = data.map((e, i) => {
      return { value: e.id, label: e.title };
    });
    setCategories(catArr);

    const statesData = await fetchStates();

    const stateArr = statesData.states.map((e, i) => ({
      value: e.name,
      label: e.name,
    }));
    setStates(stateArr);
  };

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <div>
      <Box fontSize="14px" mb="40px">
        <Box my={"10px"}>
          <Controller
            control={control}
            name="materialSchedule"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  placeholder="Material Schedule"
                  value={value}
                  onChange={onChange}
                  label="Material Schedule Name"
                  isRequired
                />
                <div style={{ color: "red" }}>
                  {errors["materialSchedule"]
                    ? errors["materialSchedule"]?.message
                    : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Box my={"10px"}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  placeholder="Cement"
                  value={value}
                  onChange={onChange}
                  label="Material Name"
                  isRequired
                />
                <div style={{ color: "red" }}>
                  {errors["name"] ? errors["name"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Box my={"10px"}>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  placeholder="Material Description"
                  value={value}
                  onChange={onChange}
                  label="Description"
                  isRequired
                />
                <div style={{ color: "red" }}>
                  {errors["description"] ? errors["description"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Box my={"10px"}>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <CustomSelect
                  value={value}
                  label="Category"
                  onChange={onChange}
                  options={categories}
                  isRequired
                  placeholder="Select a category"
                />
                <div style={{ color: "red" }}>
                  {errors["category"] ? errors["category"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Box my={"10px"}>
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  placeholder="Sharp sand material schedule"
                  value={value}
                  onChange={onChange}
                  label="Quantity"
                  isRequired
                  type="number"
                />
                <div style={{ color: "red" }}>
                  {errors["quantity"] ? errors["quantity"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Box my={"10px"}>
          <Controller
            control={control}
            name="measurement"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  placeholder="Sharp sand material schedule"
                  value={value}
                  onChange={onChange}
                  label="Measurement"
                  isRequired
                />
                <div style={{ color: "red" }}>
                  {errors["measurement"] ? errors["measurement"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Box my={"10px"}>
          <Controller
            control={control}
            name="budget"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  placeholder="1, 000, 000, 000"
                  type="number"
                  value={value}
                  onChange={onChange}
                  label="Budget"
                  isRequired
                  leftIcon={<Naira />}
                />
                <div style={{ color: "red" }}>
                  {errors["budget"] ? errors["budget"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Box my={"10px"}>
          <Controller
            control={control}
            name="deliveryDate"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  placeholder="Sharp sand material schedule"
                  value={value}
                  onChange={onChange}
                  label="Estimated Delivery Date"
                  isRequired
                  type="date"
                />
                <div style={{ color: "red" }}>
                  {errors["deliveryDate"]
                    ? errors["deliveryDate"]?.message
                    : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Flex gap={4} justify="space-between">
          <Box w="60%" my={"10px"}>
            <Controller
              control={control}
              name="deliveryAddress"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    placeholder="Enter delivery address"
                    value={value}
                    onChange={onChange}
                    label="Delivery Address"
                    isRequired
                  />
                </Box>
              )}
            />
            <div style={{ color: "red" }}>
              {errors["deliveryAddress"]
                ? errors["deliveryAddress"]?.message
                : ""}
            </div>
          </Box>
          <Box w="40%" my={"10px"}>
            <Controller
              control={control}
              name="state"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Text visibility={"hidden"}>State</Text>
                  <CustomSelect
                    placeholder="State"
                    onChange={onChange}
                    value={value}
                    options={states}
                  />
                  <div style={{ color: "red" }}>
                    {errors["state"] ? errors["state"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
        </Flex>
      </Box>

      <Button mb={10} full onClick={handleSubmit(onSubmit)} mr={3}>
        Next
      </Button>

      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Request For Quote"
        subtitle="Create an RFQ for your project"
        size="xl"
      >
        <RfqScheduledDelivery
          rfqData={rfqData}
          onCloseRfq={onClose}
          onClose={onclose}
          setDefaultIndex={setDefaultIndex}
        />
      </BaseModal>
    </div>
  );
};

export default CreateRfq;
