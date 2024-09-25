import {
  Box,
  Flex,
  Grid,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaPercent } from "react-icons/fa";
import Button from "../../../components/Button";
import Cards from "../../../components/Cards/Cards";
import EmptyState from "../../../components/EmptyState";
import Input from "../../../components/Input";
import DialogModal from "../../../components/Modals/Dialog";
import BaseModal from "../../../components/Modals/Modal";
import BaseTable from "../../../components/Table";
import DashboardWrapper from "../../../layouts/dashboard";
import {
  useAddCommissionPercentageMutation,
  useGetAllRevenuesQuery,
  useGetCommissionPercentageQuery,
  useUpdateCommissionPercentageMutation,
} from "../../../redux/api/super-admin/superAdminSlice";
import { addTransparency } from "../../../utility/helpers";

const tableColumns = [
  "S/N",
  "SUPPLIER's NAME",
  "BUILDERS NAME",
  "ITEM NAME",
  "QUANTITY",
  "AMOUNT (₦)",
  "DELIVERY DATE",
  "COMMISSION (₦)",
];

const SuperAdminTransactionsRevenues = () => {
  const toast = useToast();
  const { data: revenuesData, isLoading } = useGetAllRevenuesQuery();
  const { data: commissionData, refetch: refetchGetCommissionPercentage } =
    useGetCommissionPercentageQuery();
  const [
    addFn,
    {
      isLoading: isAdding,
      isSuccess: addSuccess,
      isError: addFailed,
      error: addError,
    },
  ] = useAddCommissionPercentageMutation();

  const [
    updateFn,
    {
      isLoading: isUpdating,
      isSuccess: updateSuccess,
      isError: updateFailed,
      error: updateError,
    },
  ] = useUpdateCommissionPercentageMutation();
  const [activeCommission, setActiveCommission] = useState(null);

  const tableData = useMemo(() => {
    if (!revenuesData || !revenuesData.data) return [];
    return revenuesData.data.revenues.map((d, index) => {
      const {
        Builder,
        Vendor,
        RfqQuote: { RfqRequestMaterial },
        totalCost,
        RfqRequest,
        fee,
      } = d;

      const { businessName: builderName } = Builder;
      const { businessName: vendorName } = Vendor;
      const { deliveryDate } = RfqRequest;
      const { name: ItemName, quantity } = RfqRequestMaterial;
      return {
        "S/N": index < 9 ? `0${index + 1}` : index + 1,
        "SUPPLIER's NAME": vendorName,
        "BUILDERS NAME": builderName,
        "ITEM NAME": ItemName,
        QUANTITY: Intl.NumberFormat().format(quantity),
        "AMOUNT (₦)": Intl.NumberFormat().format(totalCost),
        "DELIVERY DATE": deliveryDate,
        "COMMISSION (₦)": Intl.NumberFormat().format(fee),
      };
    });
  }, [revenuesData]);

  useEffect(() => {
    if (!commissionData || !commissionData.data) return;

    const active = commissionData.data.find((c) => c.active === true);
    if (active) {
      setActiveCommission(active);
      setCommission(active.percentageNumber);
    }
  }, [commissionData]);

  const [commission, setCommission] = useState("");

  function handleChange(e) {
    setCommission(+e.target.value);
  }

  const {
    isOpen: commissionFormIsOpen,
    onClose: onCloseCommissionForm,
    onOpen: onOpenCommissionForm,
  } = useDisclosure();

  const {
    isOpen: commissionConfirmDialogIsOpen,
    onOpen: onOpenCommissionConfirmDialog,
    onClose: onCloseCommissionConfirmDialog,
  } = useDisclosure();

  function onSubmit() {
    onOpenCommissionConfirmDialog();
    onCloseCommissionForm();
  }

  function takeAction() {
    if (activeCommission) {
      // I WILL UPDATE

      updateFn({
        percentageNumber: commission,
        active: true,
        commissionId: activeCommission.id,
      });
    } else {
      // I WILL ADD NEW

      addFn({
        percentageNumber: commission,
      });
    }
  }

  useEffect(() => {
    if (addSuccess) {
      toast({
        status: "success",
        description: "Commission percentage added!",
      });
      refetchGetCommissionPercentage();
    }

    if (addFailed && addError) {
      toast({
        status: "error",
        description: addError.data.message,
      });
    }
  }, [addError, addFailed, addSuccess]);

  useEffect(() => {
    if (updateSuccess) {
      toast({
        status: "success",
        description: "Commission percentage updated!",
      });

      refetchGetCommissionPercentage();
    }

    if (updateFailed && updateError) {
      toast({
        status: "error",
        description: updateError.data.message,
      });
    }
  }, [updateError, updateFailed, updateSuccess]);

  function reset() {
    if (activeCommission) {
      setCommission(activeCommission.percentageNumber);
    }
  }

  return (
    <DashboardWrapper pageTitle="TRANSACTIONS">
      <Box>
        <Text
          fontSize="24px"
          fontWeight={600}
          lineHeight={1.5}
          color={"#F5852C"}
        >
          Total{" "}
          <Text as="span" color={"#12355A"}>
            Revenue
          </Text>
        </Text>
        <Text fontSize={"14px"} lineHeight={1.5} color={"#12355A"}>
          All transactions carried out on the platform are displayed here.
        </Text>
      </Box>

      <Flex
        mt={"22px"}
        justify={"space-between"}
        wrap={"wrap"}
        alignItems={"flex-start"}
      >
        <Box minWidth={"280px"}>
          <Cards
            cardDetail={{
              name: "Total Revenue",
              isCurrency: true,
              quantity: revenuesData?.data.totalRevenue,
              icon: <FaCheckCircle size={"24px"} />,
            }}
            h="128px"
            bg="#FFBD00"
          />
        </Box>

        <Flex direction={"row-reverse"} align={"center"} gap={"8px"}>
          <Button
            type="button"
            fontWeight="600"
            // width={{ base: "180px", md: "242px" }}
            background="#F5852C"
            onClick={(e) => {
              e.stopPropagation();
              onOpenCommissionForm();
            }}
            isLoading={isAdding || isLoading || isUpdating}
          >
            Set Commission
          </Button>

          <Text fontWeight="600">
            {activeCommission?.percentageNumber || 0}%
          </Text>
        </Flex>
      </Flex>

      <Box
        mt={"12px"}
        py={"12px"}
        px={"6px"}
        borderRadius={"8px"}
        backgroundColor={addTransparency("#F5852C", 0.04)}
      >
        <Flex justifyContent={"flex-end"} gap={"2rem"}>
          <Box flexGrow={1} maxW={"420px"}>
            <Input placeholder="Search ..." />
          </Box>
        </Flex>
      </Box>

      <Box>
        <BaseTable
          tableColumn={tableColumns}
          tableBody={tableData}
          isLoading={isLoading}
          empty={<EmptyState>Nothing to display...</EmptyState>}
        />
      </Box>

      {commissionFormIsOpen && (
        <BaseModal
          isOpen={true}
          title={"Set commission"}
          size="md"
          onClose={onCloseCommissionForm}
        >
          <form onSubmit={onSubmit}>
            <Grid gap={"24px"}>
              <Input
                leftIcon={<FaPercent />}
                type="number"
                value={commission}
                onChange={handleChange}
                isRequired
                max={100}
                min={0}
              />
              <Button full isSubmit>
                Save
              </Button>
            </Grid>
          </form>
        </BaseModal>
      )}

      {commissionConfirmDialogIsOpen && (
        <DialogModal
          onClose={() => {
            reset();
            onCloseCommissionConfirmDialog();
          }}
          isOpen={true}
          onNo={onCloseCommissionConfirmDialog}
          title="Confirm"
          message={`Are you sure you want to set ${commission}% commission?`}
          onYes={takeAction}
          isLoading={isAdding || isLoading || isUpdating}
          showSuccessMessage={addSuccess || updateSuccess}
          successMessage={"Success!"}
        ></DialogModal>
      )}
    </DashboardWrapper>
  );
};

export default SuperAdminTransactionsRevenues;
