import React, { useEffect, useState } from "react";
import Button from "../../../../components/Button";
import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import Input, { InputPhone } from "../../../../components/Input";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import instance from "../../../../utility/webservices";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import Naira from "../../../../components/Icons/Naira";
import BaseModal from "../../../../components/Modals/Modal";
import RfqScheduledDelivery from "./rfqScheduledDelivery";
import { fetchStates } from "../../../../utility/queries";
import moment from "moment";

const CreateRfq = ({ onclose, materialList, setDefaultIndex, details }) => {
  const [categories, setCategories] = useState([]);
  const [itemsByCategories, setItemsByCategories] = useState([]);
  const [itemsSpecification, setItemsSpecification] = useState([]);
  const [states, setStates] = useState([]);
  const [rfqData, setRfqData] = useState({});
  const schema = yup.object({
    name: yup.object().required("Material Name is required"),
    description: yup.string().required("Description is required"),
    quantity: yup.string().required("Quantity is required"),
    measurement: yup.string().required("Measurement is required"),
    budget: yup.string().required("Budget is required"),
    deliveryAddress: yup.string().required("Delivery Address is required"),
    deliveryDate: yup.string().required("Delivery Date is required"),
    category: yup.object().required("Category is required"),
    state: yup.object().required("State is required"),
    deliveryContact: yup
      .string()
      .required("Delivery contact number is required"),
  });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const defaultValues = {
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

  const itemCategory = useWatch({
    control,
    name: "category",
  });

  const itemName = useWatch({
    control,
    name: "name",
  });

  useEffect(() => {
    if (itemCategory) {
      getItemsByCategories(itemCategory?.value);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCategory]);

  useEffect(() => {
    if (itemName) {
      getProductMetric(itemName?.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemName]);

  useEffect(() => {
    if (materialList) {
      Object.keys(defaultValues).forEach((key) => {
        setValue(key, materialList[key]);
      });
    }

    setValue("state", { name: details?.location, label: details?.location });

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

  const getItemsByCategories = async (categoryId) => {
    const { data } = (
      await instance.get(`/product/category/${categoryId}?page_size=1000`)
    ).data;

    const categroyDetails = data.map((e, i) => {
      return { value: e.id, label: e.name, metric: e?.metric };
    });

    setItemsByCategories(categroyDetails);
    setValue("name", categroyDetails[0]);
    setItemsSpecification([]);
    setValue("specification", undefined);
    setValue("measurement", "");
  };

  const getProductMetric = async (itemId) => {
    const { data } = (await instance.get(`/product/${itemId}?page_size=1000`))
      .data;

    const specs = data?.specifications?.map((e, i) => ({
      value: e?.id,
      label: e?.value,
    }));
    setValue("specification", specs[0]);
    setItemsSpecification(specs);
    setValue("measurement", data?.metric?.name);
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
                  placeholder="Material Schedule Name"
                  value={value}
                  onChange={onChange}
                  label="Material Schedule Name"
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
            name="category"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <CustomSelect
                  value={value}
                  label="Material Category"
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
            name="name"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <CustomSelect
                  placeholder="Type to search for product"
                  value={value}
                  options={itemsByCategories}
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
            name="specification"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <CustomSelect
                  placeholder="Type to search for product"
                  value={value}
                  options={itemsSpecification}
                  onChange={onChange}
                  label="Material specification"
                  isRequired
                />
                <div style={{ color: "red" }}>
                  {errors["specification"] && errors["specification"]?.message}
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
            name="quantity"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  placeholder="1,000,000"
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
                  placeholder="Metric"
                  readOnly
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
                  label="Budget per item"
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
                  min={moment().format("YYYY-MM-DD")}
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

        <Box my={"10px"}>
          <Controller
            control={control}
            name="deliveryContact"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <InputPhone
                  placeholder="0987654321"
                  value={value}
                  onChange={onChange}
                  label="Delivery Contact Number"
                  type="number"
                  isRequired
                />
                <div style={{ color: "red" }}>
                  {errors["deliveryContact"]
                    ? errors["deliveryContact"]?.message
                    : ""}
                </div>
              </Box>
            )}
          />
        </Box>
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
