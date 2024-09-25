import { Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect/CustomSelect";
import { BiSolidEditAlt } from "react-icons/bi";
import { useAddProcurementManToFundManagerMutation } from "../redux/api/super-admin/fundManagerSlice";
import { useAddProcurementManToBuilderMutation } from "../redux/api/super-admin/builderSlice";
import { handleError, handleSuccess } from "../utility/helpers";
import { useAddProcurementManToVendorMutation } from "../redux/api/super-admin/vendorSlice";

export default function SelectProcurementManager({
  userData,
  procurementManagers,
  refetch,
  userType,
}) {
  const [selectProcurementMan, setSelectProcurementMan] = useState("");
  const [showProcurementList, setShowProcurementList] = useState({});
  const [procurementList, setProcurementList] = useState([]);

  const [
    addProcurementManToFundManager,
    { isLoading, isSuccess, error, isError },
  ] = useAddProcurementManToFundManagerMutation();

  const [
    addProcurementManToBuilder,
    {
      isLoading: isLoadingBuilder,
      isSuccess: isSuccessBuilder,
      error: builderError,
      isError: isErrorBuilder,
    },
  ] = useAddProcurementManToBuilderMutation();

  const [
    addProcurementManToVendor,
    {
      isLoading: isLoadingVendor,
      isSuccess: isSuccessVendor,
      error: vendorError,
      isError: isErrorVendor,
    },
  ] = useAddProcurementManToVendorMutation();

  const onChangeSelectProcurementMan = (e, id) => {
    setSelectProcurementMan(e);
    if (userType === "fundManager") {
      addProcurementManToFundManager({
        fundmanagerId: id,
        procurementManagerId: e.value,
      });
    } else if (userType === "builder") {
      addProcurementManToBuilder({
        builderId: id,
        procurementManagerId: e.value,
      });
    } else if (userType === "vendor") {
      addProcurementManToVendor({
        vendorId: id,
        procurementManagerId: e.value,
      });
    }
  };

  useEffect(() => {
    if (procurementManagers) {
      const lists = procurementManagers?.map((item) => {
        return {
          value: item.UserId,
          label: item?.user?.name,
        };
      });
      setProcurementList(lists);
    }
  }, [procurementManagers]);

  useEffect(() => {
    if (isSuccess || isSuccessBuilder || isSuccessVendor) {
      handleSuccess("Procurement manager added successfully!");
      refetch();
      setSelectProcurementMan("");
      setShowProcurementList({});
    }
    if (isError || isErrorBuilder || isErrorVendor) {
      handleError(error || builderError || vendorError);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isLoadingBuilder, isLoadingVendor]);

  return (
    <Flex>
      {Boolean(showProcurementList.show) ? (
        <CustomSelect
          options={procurementList}
          value={selectProcurementMan}
          onChange={(e) => onChangeSelectProcurementMan(e, userData.id)}
          isDisabled={isLoading}
          isLoading={isLoading}
        />
      ) : (
        <>
          <Text>{userData?.procurementManager?.name}</Text>
          <BiSolidEditAlt
            color="#565759"
            fontSize="16px"
            cursor="pointer"
            onClick={() =>
              setShowProcurementList({
                id: userData.id,
                show: true,
              })
            }
          />
        </>
      )}
    </Flex>
  );
}
