import React, { useState } from "react";
import Button from "../../../../components/Button";
import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import Input, { TextArea } from "../../../../components/Input";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { handleError, handleSuccess } from "../../../../utility/helpers";
import instance from "../../../../utility/webservices";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import { HiPlus } from "react-icons/hi2";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import DeleteIcon from "../../../../components/Icons/Delete";

const RfqScheduledDelivery = ({
  onClose,
  onCloseRfq,
  rfqData,
  setDefaultIndex,
}) => {
  const [scheduledDelivery, setScheduledDelivery] = useState(false);
  const [scheduledDeliveryError, setScheduledDeliveryError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const paymentOptions = [
    { value: "PAY_ON_DELIVERY", label: "Pay on delivery" },
    { value: "BNPL", label: "Buy now pay later (BNPL)" },
  ];
  const { projectId } = useParams();

  let schemaObj = {
    // payment: yup.object().required("Payment method is required"),
  };
  if (scheduledDelivery) {
    schemaObj = {
      // payment: yup.object().required("Payment method is required"),
      items: yup.array().of(
        yup.object().shape({
          quantity: yup.string().required("Quantity is required"),
          description: yup.string().required("Description is required"),
          dueDate: yup.string().required("Date is required"),
        })
      ),
    };
  }

  const schema = yup.object().shape(schemaObj);

  const defaultValues = {
    items: [{ quantity: "", description: "", dueDate: "" }],
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchdeliverySchedule = watch();

  const onSubmit = async (data) => {
    const totalQuantity = data.items.reduce((acc, cur) => {
      return Number(acc) + Number(cur.quantity);
    }, 0);

    if (scheduledDelivery && +totalQuantity !== +rfqData?.quantity) {
      setScheduledDeliveryError(true);
      return handleError(
        "Error, please check the quantity specified in delivery schedule."
      );
    }

    setLoading(true);

    const payload = {
      title: rfqData.materialSchedule,
      materialSchedule: rfqData.materialSchedule,
      canRecieveQuotes: true,
      budgetVisibility: true,
      deliveryDate: rfqData.deliveryDate,
      deliveryAddress: rfqData.deliveryAddress,
      location: rfqData?.state.value,
      deliveryInstructions: rfqData.description,
      requestType: "PUBLIC",
      paymentTerns: data?.payment?.value,
      tax: true,
      taxPercentage: 5,
      // lpo: "https://cloudinary.com",
      projectId: projectId,
      deliverySchedule: scheduledDelivery ? [...data?.items] : [],
      materials: [
        {
          itemName: rfqData?.name,
          rfqCategoryId: rfqData?.category.value,
          description: rfqData?.description,
          metric: rfqData?.measurement,
          quantity: rfqData?.quantity,
          budget: rfqData?.budget,
        },
      ],
    };

    try {
      await instance.post("/builder/rfq", payload);

      handleSuccess("RFQ has been created");
      onClose();
      onCloseRfq();
      setLoading(false);
      setDefaultIndex(1);
    } catch (error) {
      console.log(error);
      handleError(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <Box mb="40px">
        <Box my={"10px"}>
          <Flex justify="space-between">
            <Box>
              <Text>Scheduled Delivery</Text>
              <Text fontSize="15px" color="info">
                Choose the schedule for your delivery
              </Text>
            </Box>
            <Box>
              <Switch
                id="email-alerts"
                onChange={() => setScheduledDelivery(!scheduledDelivery)}
              />
            </Box>
          </Flex>
        </Box>
        {scheduledDelivery && (
          <Box>
            <Box my={"10px"}>
              <Input
                placeholder="1000 Tonnes"
                value={rfqData?.quantity}
                label="Quantity"
                isRequired
                isDisabled
              />
            </Box>

            {/* Dynamic fields for quantity, desc, and date */}
            {fields.map((item, index) => (
              <Box my={"50px"} key={item.id}>
                <Flex my="10px" justify="space-between">
                  <Text>Delivery {index + 1}</Text>
                  <Text fontWeight="600" color="secondary">
                    {Math.round(
                      ((watchdeliverySchedule?.items[index]?.quantity || 0) /
                        rfqData?.quantity) *
                        100
                    )}
                    %
                  </Text>
                </Flex>
                <Controller
                  control={control}
                  name={`items.${index}.quantity`}
                  defaultValue={item.quantity}
                  render={({ field: { onChange, value } }) => (
                    <Box my="10px" w={"100%"}>
                      <Input
                        placeholder="100"
                        value={value}
                        onChange={onChange}
                        label={`Quantity`}
                        isRequired
                        type="number"
                      />
                      <div style={{ color: "red", fontSize: "14px" }}>
                        {errors?.items &&
                          errors?.items[index]?.quantity &&
                          errors?.items[index]?.quantity?.message}
                      </div>
                    </Box>
                  )}
                />

                <Controller
                  control={control}
                  name={`items.${index}.description`}
                  render={({ field: { onChange, value } }) => (
                    <Box my="10px" w={"100%"}>
                      <TextArea
                        placeholder="Description for delivery schedule"
                        value={value}
                        onChange={onChange}
                        label={`Description`}
                        isRequired
                      />
                      <div style={{ color: "red", fontSize: "14px" }}>
                        {errors?.items &&
                          errors?.items[index]?.description &&
                          errors?.items[index]?.description?.message}
                      </div>
                    </Box>
                  )}
                />

                <Controller
                  control={control}
                  name={`items.${index}.dueDate`}
                  render={({ field: { onChange, value } }) => (
                    <Box my="10px" w={"100%"}>
                      <Input
                        placeholder="100"
                        value={value}
                        onChange={onChange}
                        label={`Date`}
                        isRequired
                        type="date"
                      />
                      <div style={{ color: "red", fontSize: "14px" }}>
                        {errors?.items &&
                          errors?.items[index]?.dueDate &&
                          errors?.items[index]?.dueDate?.message}
                      </div>
                    </Box>
                  )}
                />

                {fields.length > 1 && (
                  <Flex justify="flex-end">
                    <button
                      style={{ color: "red" }}
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <DeleteIcon color="#f5852c" />
                    </button>
                  </Flex>
                )}
              </Box>
            ))}

            <Flex justify="flex-end" color="secondary">
              <Flex cursor="pointer" onClick={() => append({})} align="center">
                <HiPlus /> <Text>Add more schedule</Text>
              </Flex>
            </Flex>
          </Box>
        )}

        <Box my={"30px"}>
          <Text>Payment Details</Text>
          <Box my={"10px"}>
            <Controller
              control={control}
              name="payment"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <CustomSelect
                    value={value}
                    label="Payment Method"
                    onChange={onChange}
                    isRequired
                    options={paymentOptions}
                    placeholder="Select a payment method"
                  />
                  <div style={{ color: "red", fontSize: "14px" }}>
                    {errors["payment"] ? errors["payment"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
        </Box>
      </Box>

      <Button
        mb={10}
        full
        isLoading={isLoading}
        onClick={handleSubmit(onSubmit)}
        mr={3}
      >
        Next
      </Button>
      <Text textAlign="center" my="10px" color="red">
        {scheduledDeliveryError &&
          "Ensure all delivery schedule(s) sum to 100%"}
      </Text>
    </div>
  );
};

export default RfqScheduledDelivery;
