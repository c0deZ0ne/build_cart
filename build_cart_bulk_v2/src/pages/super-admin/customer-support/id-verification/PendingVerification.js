import { Box, Flex, SimpleGrid, Text, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BaseTable from "../../../../components/Table";
import moment from "moment/moment";
import EmptyState from "../../../../components/EmptyState";
import instance from "../../../../utility/webservices";
import Button, { Button2 } from "../../../../components/Button";
import { handleError } from "../../../../utility/helpers";
import BaseModal from "../../../../components/Modals/Modal";
import Input, { TextArea } from "../../../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Naira from "../../../../components/Icons/Naira";
import { capitalize } from "lodash";
import useModalHandler from "../../../../components/Modals/SuccessModal";
import BusinessInfo from "./modals/businessInfo";

const PendingVerification = ({
  data,
  setDefaultIndex,
  getAllBidData,
  isLoading,
}) => {
  const [rfq, setRfq] = useState({});
  const [isLoadingSubmit, setLoadingSubmit] = useState(false);
  const [tableBody, setTableBody] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSuccessModal, ModalComponent } = useModalHandler();

  const tableColumn = [
    "S/N",
    "CUSTOMER'S NAME",
    "CUSTOMER TYPE",
    "EMAIL",
    "PHONE NUMBER",
    "SIGNUP DATE",
    "ACTION",
  ];

  useEffect(() => {
    data = [{}];
    const arr = [];
    let counter = 1;
    data.forEach((item, index) => {
      arr.push({
        SN: `0${counter}`,
        customername: capitalize(item?.CreatedBy?.name),
        type: capitalize(item?.paymentTerm?.replaceAll("_", " ")),
        itemname: capitalize(item?.name) ?? "-",
        email: capitalize(item?.name) ?? "-",
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
              Review
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
            There are no{" "}
            <Text as="span" color="secondary">
              {" "}
              Pending ID Verification Requests
            </Text>{" "}
            on the platform.
          </EmptyState>
        }
      />

      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        title={"Buiness Information"}
        subtitle={"Verify customer's business information."}
      >
        <BusinessInfo isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      </BaseModal>

      {ModalComponent}
    </Box>
  );
};

export default PendingVerification;
