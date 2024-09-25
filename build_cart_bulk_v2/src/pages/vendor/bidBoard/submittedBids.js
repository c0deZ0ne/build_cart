import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { capitalize } from "lodash";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import Badge from "../../../components/Badge/Badge";
import Button, { Button2 } from "../../../components/Button";
import EmptyState from "../../../components/EmptyState";
import Naira from "../../../components/Icons/Naira";
import Input from "../../../components/Input";
import BaseModal from "../../../components/Modals/Modal";
import BaseTable from "../../../components/Table";
import instance from "../../../utility/webservices";
import useModalHandler from "../../../components/Modals/SuccessModal";
import { handleError } from "../../../utility/helpers";

const SubmittedBids = ({
  data,
  setDefaultIndex,
  getAllBidData,
  isLoadingRfq,
}) => {
  const [tableBody, setTableBody] = useState([]);
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);

  const [rfq, setRfq] = useState({});

  const { isOpen, onClose, onOpen } = useDisclosure();
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
    "ITEM NAME",
    "QUANTITY",
    "UNIT AMOUNT (₦)",
    "EXPECTED DELIVERY",
    "PAYMENT TYPE",
    "STATUS",
    "ACTION",
  ];

  useEffect(() => {
    const arr = [];
    let counter = 1;

    data?.totalBid?.forEach((item, index) => {
      item?.bid?.RfqQuotes &&
        item?.bid?.RfqQuotes?.forEach((element, i) => {
          arr.push({
            SN: `0${counter}`,
            itemname: capitalize(element?.RfqRequestMaterial?.name) ?? "-",
            quantity: Intl.NumberFormat().format(
              element?.RfqRequestMaterial?.quantity ?? 0,
            ),
            amount: new Intl.NumberFormat().format(
              (element?.RfqQuoteBargain?.length > 0
                ? element?.RfqQuoteBargain[0]?.price
                : element?.RfqRequestMaterial?.budget) ?? 0,
            ),
            expectedDelivery: moment(
              element?.RfqQuoteBargain?.length > 0
                ? element?.RfqQuoteBargain[0]?.deliveryDate
                : item?.bid?.deliveryDate,
            ).format("DD-MM-YYYY"),
            paymentType: capitalize(
              item?.bid?.paymentTerm?.replaceAll("_", " "),
            ),
            status: <Badge status={item?.bid?.status} />,
            ACTION: (
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
    });

    setTableBody(arr);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (rfq?.bid) {
      const { bid } = rfq;
      const { deliveryDate } = bid;
      const { metric, budget } = bid.RfqQuotes[0].RfqRequestMaterial;

      const bargainObj = bid.RfqQuotes[0].RfqQuoteBargain[0];

      const price = bargainObj ? bargainObj.price : budget;
      const deliDate = bargainObj ? bargainObj.deliveryDate : deliveryDate;

      setValue("quantity", rfq?.bid.RfqQuotes[0].RfqRequestMaterial.quantity);
      setValue("deliveryDate", moment(deliDate).format("YYYY-MM-DD"));
      setValue("measurement", metric);
      setValue("price", price);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rfq]);

  const { handleSuccessModal, ModalComponent } = useModalHandler();

  const onSubmit = async (fields) => {
    setLoadingSubmit(true);
    try {
      const payload = {
        tax: 10,
        logisticCost: 1000,
        rfqRequestId: rfq?.bid.id,
        canBargain: true,
        deliveryDate: fields?.deliveryDate ?? rfq?.deliveryDate,
        additionalNote: fields?.additionalInformation,
        materials: [
          {
            rfqRequestMaterialId: rfq?.bid.RfqQuotes[0].RfqRequestMaterial?.id,
            price: Number(fields?.price),
            quantity: Number(fields?.quantity),
            description: rfq?.bid.RfqQuotes[0].RfqRequestMaterial?.description,
          },
        ],
        ProjectId: rfq?.bid.RfqQuotes[0].RfqRequestMaterial?.ProjectId,
      };

      await instance.post(`/vendor/rfq/bargain`, payload);

      handleSuccessModal("You have successfully submitted a bid");
      getAllBidData();
      onClose();
      setLoadingSubmit(false);
    } catch (error) {
      console.log(error);
      handleError(error);
      setLoadingSubmit(false);
    }
  };

  return (
    <Box my="20px">
      <BaseTable
        tableColumn={tableColumn}
        tableBody={tableBody}
        isLoading={isLoadingRfq}
        empty={
          <EmptyState>
            you have not{" "}
            <Text as="span" color="primary">
              {" "}
              Submitted any bids yet.
            </Text>{" "}
            <Text as="span" color="secondary">
              {" "}
              Accept or Bargain bids
            </Text>{" "}
            from all RFQ tab.
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
                  <Textarea
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

export default SubmittedBids;
