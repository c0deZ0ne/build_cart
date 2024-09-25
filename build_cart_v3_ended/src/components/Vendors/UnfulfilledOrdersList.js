import { Box, Flex, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import BaseTable from "../../components/Table";
import { useGetUnfufilledOrderQuery } from "../../redux/api/vendor/vendor";
import { addTransparency } from "../../utility/helpers";
import StatusPill from "../Builder/ProjectInvitations/StatusPill";
import Button from "../Button";
import EmptyState from "../EmptyState";
import DispatchTimeModal from "./DispatchTimeModal";

const tableColumns = [
  "S/N",
  "ITEM NAME",
  "QUANTITY",
  "AMOUNT (₦)",
  "DELIVERY ADDRESS",
  "DELIVERY DATE",
  "STATUS",
  "ACTION",
];

function statusColor(status) {
  const sta = status.toLowerCase();
  if (sta === "pending") return "#FFBD00";
  if (sta === "completed") return "#1C903D";
  return "#000000";
}

function createStatus(statuses) {
  const isMultiple = statuses.length > 1;
  if (isMultiple) {
    return (
      <Flex>
        {statuses.map((status, jdx) => {
          const color = statusColor(status);
          return (
            <StatusPill
              key={jdx}
              color={color}
              status={capitalize(status)[0]}
            />
          );
        })}
      </Flex>
    );
  } else {
    const status = statuses[0];
    const color = statusColor(status);
    return <StatusPill color={color} status={capitalize(status)} />;
  }
}

/**
 *
 * @param {{SN: string, name: string, quantity: string | number, amount: string | number, address: string, dueDate: string, hasAction: boolean, isChild: boolean, customClass: string, status: string[], showDropdown: boolean, contractId: string, deliveryScheduleId: string, numOfChildren: number, phoneNumber: string, onSuccess: () => void}} arg - items needed to create a tableRow
 * @returns
 */
function processSchedule({
  SN,
  name,
  quantity,
  amount,
  address,
  dueDate,
  hasAction,
  isChild,
  customClass,
  status,
  showDropdown,
  contractId,
  deliveryScheduleId,
  numOfChildren,
  phoneNumber,
  onSuccess,
}) {
  return {
    "S/N": (
      <Box>
        {SN}
        {showDropdown && (
          <Button size="sm" background="transparent" color="#12355a">
            <FaAngleDown />
          </Button>
        )}
      </Box>
    ),
    "ITEM NAME": name,
    QUANTITY: (
      <Flex align={"center"} gap={"8px"}>
        {Intl.NumberFormat("en-ng").format(quantity)}
        {numOfChildren > 0 && (
          <Flex
            align={"center"}
            justify={"center"}
            height={"24px"}
            width={"24px"}
            borderRadius={"50%"}
            color={"secondary"}
            fontSize={"12px"}
            fontWeight={600}
            backgroundColor={addTransparency("#F5852C", 0.16)}
          >
            {numOfChildren}
          </Flex>
        )}
      </Flex>
    ),
    "AMOUNT (₦)": isChild ? "-" : Intl.NumberFormat("en-ng").format(amount),
    "DELIVERY ADDRESS": address,
    "DELIVERY DATE": dueDate.split("T")[0],
    STATUS: createStatus(status),
    ACTION: hasAction ? (
      <ActionButton
        contractId={contractId}
        deliveryScheduleId={deliveryScheduleId}
        address={address}
        onSuccess={onSuccess}
        phoneNumber={phoneNumber}
      />
    ) : null,
    isExpandable: !isChild && numOfChildren > 0,
    customClass: `${customClass} ${isChild ? "is-sub" : ""}`,
  };
}

function processSchedulesArray(
  SN,
  address,
  customClass,
  contractId,
  schedules,
  phoneNumber,
  onSuccess
) {
  const {
    dueDate,
    RfqRequestMaterial: { name, budget, quantity: totalQuantity },
    id: deliveryScheduleId,
    status,
    quantity,
  } = schedules[0];
  if (schedules.length === 1) {
    const obj = processSchedule({
      SN,
      name,
      quantity,
      budget,
      address,
      dueDate,
      isChild: false,
      hasAction: true,
      customClass,
      showDropdown: false,
      numOfChildren: 0,
      status: [status],
      amount: budget,
      contractId: contractId,
      deliveryScheduleId,
      onSuccess,
      phoneNumber,
    });

    return [obj];
  }
  const result = [];
  schedules.forEach((schedule) => {
    const {
      dueDate,
      RfqRequestMaterial: { name, budget },
      id: deliveryScheduleId,
      status,
      quantity,
    } = schedule;

    const obj = processSchedule({
      SN: "",
      name,
      quantity,
      budget,
      dueDate,
      address,
      contractId,
      customClass,
      isChild: true,
      numOfChildren: 0,
      showDropdown: false,
      status: [status],
      hasAction: true,
      deliveryScheduleId,
      amount: budget,
      onSuccess,
      phoneNumber,
    });

    result.push(obj);
  });

  const totalAmountAndQuantity = schedules.reduce(
    (acc, curr) => {
      const { quantity } = curr;
      const { budget } = curr.RfqRequestMaterial;

      acc.amount += +budget;
      acc.quantity += +quantity;

      return acc;
    },
    { amount: 0, quantity: 0 }
  );

  const parent = processSchedule({
    SN,
    name,
    quantity: totalQuantity,
    amount: budget,
    address: address,
    contractId,
    customClass,
    deliveryScheduleId,
    dueDate,
    hasAction: !true,
    isChild: false,
    numOfChildren: schedules.length,
    showDropdown: true,
    status: schedules.reduce((acc, curr) => {
      return acc.concat(curr.status);
    }, []),
    onSuccess,
    phoneNumber,
  });

  result.unshift(parent);
  return result;
}

/**
 *
 * @param {object} props
 * @param {string} props.contractId
 * @param {string} props.deliveryScheduleId
 * @param {string} props.address
 * @param {string} props.phoneNumber
 * @param {() => void} props.onSuccess
 * @returns
 */
const ActionButton = ({
  contractId,
  deliveryScheduleId,
  address,
  phoneNumber,
  onSuccess,
}) => {
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  return (
    <Box>
      <Button
        size="sm"
        fontSize="14px"
        background={addTransparency("#074794", 0.16)}
        color="#074794"
        onClick={() => setShowDispatchModal(true)}
      >
        Dispatch
      </Button>
      {showDispatchModal && (
        <DispatchTimeModal
          // key={renderKey}
          onSuccess={onSuccess}
          address={address}
          isOpen={true}
          contractId={contractId}
          deliveryScheduleId={deliveryScheduleId}
          phoneNumber={phoneNumber}
          onClose={() => {
            setShowDispatchModal(false);
          }}
        />
      )}
    </Box>
  );
};

/**
 *
 * @param {object} props
 * @param {string} props.searchTerm
 * @param {(num: number) => void} props.setCount
 * @returns
 */
const UnfulfilledOrdersList = ({ searchTerm, setCount }) => {
  const [search, setSearch] = useState(searchTerm);

  useEffect(() => {
    let timer = setTimeout(() => setSearch(searchTerm), 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, refetch } = useGetUnfufilledOrderQuery(search, {
    refetchOnMountOrArgChange: true,
  });

  const tableData = useMemo(() => {
    if (!data) return [];
    if (!data.data) return [];

    const orders = [...data.data.orders];

    orders.sort(function (a, b) {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });

    const mapped = orders.map((d, index) => {
      const SN = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
      const {
        ContractId,
        RfqRequest: {
          deliveryAddress,
          CreatedBy: { phoneNumber },
        },
        deliverySchedules: schedules,
      } = d;

      return processSchedulesArray(
        SN,
        deliveryAddress,
        d.id,
        ContractId,
        schedules,
        phoneNumber,
        refetch
      );
    });

    return mapped.flat();
  }, [data, refetch]);

  useEffect(() => {
    if (!data) return;
    if (!data.data) return;
    setCount(data.data.orders.length);
  }, [setCount, data]);

  function handleRowClick(data) {
    if (data.isExpandable) {
      const items = document.getElementsByClassName(data.customClass);

      const subs = Array.from(items).filter((item) =>
        item.classList.contains("is-sub")
      );
      // const [parent, ...rest] = items;

      subs.forEach((sub) => {
        sub.classList.toggle("show");
      });
    }
  }

  return (
    <Box>
      <BaseTable
        tableColumn={tableColumns}
        tableBody={tableData}
        isLoading={isLoading}
        onClick={(d) => handleRowClick(d)}
        skipRender={["customClass", "isExpandable"]}
        pointerCursor
        empty={
          <EmptyState>
            <Text>Nothing to show</Text>
          </EmptyState>
        }
      />
    </Box>
  );
};

export default UnfulfilledOrdersList;
