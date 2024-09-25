import { Box, Flex, SimpleGrid, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "../../../components/Table";
import moment from "moment/moment";
import EmptyState from "../../../components/EmptyState";
import instance from "../../../utility/webservices";
import Button, { Button2 } from "../../../components/Button";
import { handleError } from "../../../utility/helpers";
import BaseModal from "../../../components/Modals/Modal";
import Input, { TextArea } from "../../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Naira from "../../../components/Icons/Naira";
import { capitalize } from "lodash";
import useModalHandler from "../../../components/Modals/SuccessModal";

const AllRfq = ({ data, setDefaultIndex, getAllBidData, isLoading }) => {
  const [rfq, setRfq] = useState({});
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  const [tableBody, setTableBody] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSuccessModal, ModalComponent } = useModalHandler();

  const defaultValues = {
    additionalInformation: "",
    quantity: "",
    price: "",
    deliveryDate: "",
  };

  const schema = yup.object({
    quantity: yup.string().required("Quantity is required"),
    price: yup.string().required("Budget is required"),
    deliveryDate: yup.string().required("Delivery Date is required"),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (rfq?.RfqRequestMaterials) {
      setValue("quantity", rfq?.RfqRequestMaterials[0]?.quantity);
      setValue("deliveryDate", moment(rfq?.deliveryDate).format("YYYY-MM-DD"));
      setValue("measurement", rfq?.RfqRequestMaterials[0]?.metric);
      setValue("price", rfq?.RfqRequestMaterials[0]?.budget);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rfq]);

  const tableColumn = [
    "S/N",
    "BUILDER'S NAME",
    "ITEM NAME",
    "QUANTITY",
    "UNIT AMOUNT (₦)",
    "PAYMENT TYPE",
    "EXPECTED DELIVERY DATE",
    "ACTION",
  ];

  useEffect(() => {
    const arr = [];
    let counter = 1;
    data.forEach((item, index) => {
      arr.push({
        SN: `0${counter}`,
        buildername: capitalize(item?.CreatedBy?.name),
        itemname: capitalize(item?.RfqRequestMaterials[0]?.name) ?? "-",
        quantity: item?.RfqRequestMaterials[0]?.quantity ?? 0,
        amount: new Intl.NumberFormat().format(
          item?.RfqRequestMaterials[0]?.budget ?? 0
        ),
        paymentType: capitalize(item?.paymentTerm?.replaceAll("_", " ")),
        expectedDelivery: moment(item?.deliveryDate).format("DD-MM-YYYY"),
        action: (
          <Flex justify="space-between" gap={5}>
            <Button2
              color="#1C903D"
              onClick={() => {
                setRfq(item);
                onOpen();
              }}
            >
              Bid
            </Button2>
          </Flex>
        ),
        id: item?.id,
      });
      counter++;
    });

    setTableBody(arr);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onSubmit = async (fields) => {
    setLoadingSubmit(true);
    try {
      const payload = {
        tax: 10,
        logisticCost: 1000,
        rfqRequestId: rfq?.id,
        canBargain: true,
        deliveryDate: fields?.deliveryDate ?? rfq?.deliveryDate,
        additionalNote: fields?.additionalInformation,
        materials: [
          {
            rfqRequestMaterialId: rfq?.RfqRequestMaterials[0]?.id,
            price: Number(fields?.price),
            quantity: Number(fields?.quantity),
            description: rfq?.RfqRequestMaterials[0]?.description,
          },
        ],
        ProjectId: rfq?.RfqRequestMaterials[0]?.ProjectId,
      };

      await instance.post(`/vendor/rfq/bargain`, payload);

      handleSuccessModal("You have successfully submitted a bid");
      getAllBidData();
      onClose();
      setLoadingSubmit(false);
    } catch (error) {
      handleError(error);
      setLoadingSubmit(false);
    }
  };

  return (
    <Box my="20px">
      <BaseTable
        tableColumn={tableColumn}
        tableBody={tableBody}
        isLoading={isLoading}
        empty={
          <EmptyState>
            You've no{" "}
            <Text as="span" color="primary">
              {" "}
              Request For Quotes
            </Text>{" "}
            from builders yet.
            <Text as="span" color="secondary">
              {" "}
              When new request
            </Text>{" "}
            comes in, they will appear here.
          </EmptyState>
        }
      />

      <BaseModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setRfq({});
        }}
        size="xl"
        title={"Bargain"}
        subtitle={"Submit a competitive price for this rfq"}
        reset={reset}
      >
        <Box fontSize="14px" mb="40px">
          <Box my={"10px"}>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    placeholder="1,000,000,000"
                    value={value}
                    onChange={onChange}
                    label="Price"
                    isRequired
                    rightIcon={<Naira />}
                  />
                  <div style={{ color: "red" }}>
                    {errors["price"] ? errors["price"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
          <Box mt={"20px"} mb={"10px"}>
            <Controller
              control={control}
              name="deliveryDate"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    value={value}
                    onChange={onChange}
                    label="Delivery Date"
                    isRequired
                    isDisabled
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
          <SimpleGrid columns={2} gap={5}>
            <Box my={"10px"}>
              <Controller
                control={control}
                name="quantity"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <Input
                      placeholder=""
                      value={value}
                      onChange={onChange}
                      label="Quantity"
                      isRequired
                      type="number"
                      isDisabled
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
                      placeholder="Measurements"
                      label="Measurements"
                      onChange={onChange}
                      value={value}
                      isRequired
                      isDisabled
                    />
                    <div style={{ color: "red" }}>
                      {errors["measurement"]
                        ? errors["measurement"]?.message
                        : ""}
                    </div>
                  </Box>
                )}
              />
            </Box>
          </SimpleGrid>
          <Box my={"10px"}>
            <Controller
              control={control}
              name="additionalInformation"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <TextArea
                    placeholder="Add extra information to note"
                    value={value}
                    onChange={onChange}
                    label="Additional Information"
                  />
                  <div style={{ color: "red" }}>
                    {errors["additionalInformation"]
                      ? errors["additionalInformation"]?.message
                      : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
        </Box>

        <Button
          mb={10}
          full
          isLoading={isLoadingSubmit}
          onClick={handleSubmit(onSubmit)}
          mr={3}
        >
          Submit Bid
        </Button>
      </BaseModal>

      {ModalComponent}
    </Box>
  );
};

export default AllRfq;
