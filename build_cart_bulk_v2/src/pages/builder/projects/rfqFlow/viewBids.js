import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { RiSearch2Line } from "react-icons/ri";
import BaseTable from "../../../../components/Table";
import EmptyState from "../../../../components/EmptyState";
import instance from "../../../../utility/webservices";
import sentenceCase, {
  handleError,
  handleSuccess,
} from "../../../../utility/helpers";
import Button, { Button2 } from "../../../../components/Button";
import moment from "moment";
import useModalHandler from "../../../../components/Modals/SuccessModal";
import Input, { TextArea } from "../../../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import BaseModal from "../../../../components/Modals/Modal";
import Naira from "../../../../components/Icons/Naira";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";
import Popup from "../../../../components/Popup/Popup";
import PopOverInfo from "../components/popOverInfo";

const ViewBids = ({ data, getRequestData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [measurementOptions, setMeasurementOptions] = useState([]);
  const [tableBody, setTableBody] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingBtn, setLoadingBtn] = useState(false);
  const [bidItem, setBidItem] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSuccessModal, ModalComponent } = useModalHandler();

  const schema = yup.object({
    itemName: yup.string().required("Item Name is required"),
    quantity: yup.string().required("Quantity is required"),
    measurement: yup.object().required("Measurement is required"),
    price: yup.string().required("Offer/Price is required"),
    deliveryDate: yup.string().required("Delivery Date is required"),
  });

  const methods = useForm({
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
    if (bidItem?.RfqQuote?.RfqRequestMaterial) {
      const metric = measurementOptions.find(
        (e) => e?.value === bidItem?.RfqRequestMaterial?.metric
      );

      setValue("itemName", bidItem?.RfqQuote?.RfqRequestMaterial?.name);
      setValue("quantity", bidItem?.RfqQuote?.RfqRequestMaterial?.quantity);
      setValue(
        "deliveryDate",
        moment(bidItem?.RfqQuote?.deliveryDate).format("YYYY-MM-DD")
      );
      setValue("measurement", metric ?? measurementOptions[0]);
      setValue("price", bidItem?.RfqQuote?.RfqRequestMaterial?.budget);
      setValue("additionalInformation", bidItem?.additionalNote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bidItem]);

  const getMetrics = async () => {
    const { data } = (
      await instance.get("/product/metrics/get-metrics?page_size=100")
    ).data;
    const metric = data.map((e, i) => ({
      label: e?.name,
      value: e?.id,
      id: e?.id,
    }));

    setMeasurementOptions(metric);
  };

  useEffect(() => {
    getMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const arr = [];
    let counter = 1;

    data?.RfqQuotes?.forEach((item, i) => {
      arr.push({
        SN: `0${counter}`,
        materialName: (
          <Flex align="center">
            {sentenceCase(item?.RfqQuote?.Vendor?.createdBy?.businessName)}{" "}
            <Popup
              info={<PopOverInfo data={item?.RfqQuote?.Vendor} />}
              fill="#666"
            />
          </Flex>
        ),
        quantity: item?.RfqQuote?.RfqRequestMaterial?.quantity ?? 0,
        amount: new Intl.NumberFormat().format(item?.RfqQuote?.totalCost),
        estimatedDelivery: moment(item?.RfqQuote?.deliveryDate).format(
          "DD-MM-YYYY"
        ),
        action: (
          <Flex align="center" gap={4} cursor="pointer" color="#12355A">
            <Button2
              color="#1C903D"
              isLoading={isLoadingBtn}
              onClick={() => handleAcceptBid(item?.RfqQuote?.id)}
            >
              Accept
            </Button2>
            <Button2
              color="#FFBD00"
              onClick={() => {
                setBidItem(item);
                onOpen();
              }}
            >
              Bargain
            </Button2>
          </Flex>
        ),
        id: item?.id,
      });
      counter++;
    });

    setTableBody(arr);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const tableColumn = [
    "S/N",
    "NAME",
    "QUANTITY",
    "UNIT AMOUNT (₦)",
    "ESTIMATED DELIVERY",
    "ACTION",
  ];

  const handleAcceptBid = async (quoteId) => {
    setLoading(true);
    setLoadingBtn(true);
    try {
      await instance.patch(`/builder/rfq/${quoteId}/accept-bid`);
      setLoadingBtn(false);
      handleSuccess(
        "Bid has been successfully accepted, You can can fund your order now."
      );
      getRequestData("ORDERS");
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
      setLoadingBtn(false);
    }
  };

  const onSubmit = async (fields) => {
    try {
      const payload = {
        ProjectId: bidItem?.RfqQuote?.RfqRequestMaterial?.ProjectId,
        RfqQuoteId: bidItem?.RfqQuote?.id,
        price: Number(fields?.price),
        description:
          fields?.additionalInformation ??
          bidItem?.RfqQuote?.RfqRequestMaterial?.description,
      };

      await instance.post(`/builder/rfq/bargain`, payload);

      handleSuccessModal("You have successfully bargained a quote");
      onClose();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Box my="40px" p={"32px 24px"} background={"#FCF7F6"}>
      <Flex
        direction={["column", "column", "row"]}
        justifyContent={["space-between"]}
        alignItems={["flex-start", "flex-start", "flex-end"]}
        gap={2}
      >
        <Box fontSize="20px">
          <Text fontWeight="600" color="secondary">
            Bids
          </Text>
          <Text fontSize="14px">
            These are bids that have been submitted by various vendors.
          </Text>
        </Box>

        <Spacer />
        <Box width="max-content" position={"relative"}>
          <Flex gap={"1rem"}>
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<RiSearch2Line />}
            />
          </Flex>
        </Box>
      </Flex>

      <Box mt="20px">
        <BaseTable
          tableColumn={tableColumn}
          tableBody={tableBody}
          isLoading={isLoading}
          empty={
            <EmptyState>
              <Text>
                No{" "}
                <Text as="span" color="secondary">
                  Bids
                </Text>{" "}
                yet
              </Text>
            </EmptyState>
          }
        />
      </Box>

      <BaseModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setBidItem({});
        }}
        size="xl"
        title={"Bargain"}
        subtitle={"Negotiate the cost of items you want supplied."}
        reset={reset}
      >
        <Box fontSize="14px" mb="40px">
          <Box my={"10px"}>
            <Controller
              control={control}
              name="itemName"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    placeholder="Item Name"
                    value={value}
                    onChange={onChange}
                    label="Item Name"
                    isDisabled
                    isRequired
                  />
                  <div style={{ color: "red" }}>
                    {errors["itemName"] ? errors["itemName"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>
          <Box my={"15px"}>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    placeholder="1,000,000,000"
                    value={value}
                    type="number"
                    onChange={onChange}
                    label="Offer (Cost per item)"
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
          <Box mt={"15px"} mb={"10px"}>
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
            <Box my={"5px"}>
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
            <Box my={"5px"}>
              <Controller
                control={control}
                name="measurement"
                render={({ field: { onChange, value } }) => (
                  <Box w={"100%"}>
                    <CustomSelect
                      placeholder="Measurements"
                      label="Measurements"
                      onChange={onChange}
                      value={value}
                      isRequired
                      isDisabled
                      options={measurementOptions}
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

        <Button mb={10} full onClick={handleSubmit(onSubmit)} mr={3}>
          Make Offer
        </Button>
      </BaseModal>

      {ModalComponent}
    </Box>
  );
};

export default ViewBids;
