import { Box, Grid, GridItem, Text, useToast } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";
import React, { forwardRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import { FaUser } from "react-icons/fa";
import * as yup from "yup";
import Input, { InputPhone } from "../../components/Input";
import BaseModal from "../../components/Modals/Modal";
import { useDispatchOrderToDestinationMutation } from "../../redux/api/vendor/vendor";
import Button from "../Button";
import CalendarIcon from "../Icons/Calendar";
import LocationIcon from "../Icons/Location";

/**
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.contractId
 * @param {string} props.deliveryScheduleId
 * @param {string} props.phoneNumber
 * @param {() => void} props.onSuccess
 * @returns
 */
const DispatchTimeModal = ({
  isOpen,
  onClose,
  address,
  contractId,
  deliveryScheduleId,
  phoneNumber,
  onSuccess,
}) => {
  function isValidDate(value, format) {
    return moment(value, format, true).isValid();
  }

  const dateFormat = "dd-MM-YYYY";

  const toast = useToast();
  const formSchema = yup.object({
    address: yup.string().required("Address is required").required(),
    phone: yup.string().required("Phone number is required"),
    startDate: yup.string().required("Start date is required"),
    // .test("is-valid-date", "Date must be DD-MM-YYYY", (value) =>
    //   isValidDate(value, dateFormat)
    // ),
    endDate: yup
      .string()
      .required("End date is required")
      // .test("is-valid-date", "Date must be DD-MM-YYYY", (value) =>
      //   isValidDate(value, dateFormat)
      // )
      .test(
        "should-be-after-start",
        "End date should be after start date",
        function (end) {
          const { startDate, endDate } = this.parent;

          // console.log(new Date(startDate).toISOString(), endDate);
          return new Date(endDate) >= new Date(startDate);
        }
      ),
  });

  const methods = useForm({
    defaultValues: {
      address: address,
      phone: phoneNumber,
      startDate: "",
      endDate: "",
    },
    resolver: yupResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const [dispatchFn, { isLoading, isSuccess, isError, error: apiError }] =
    useDispatchOrderToDestinationMutation();

  const onSubmit = (data) => {
    const { startDate, endDate } = data;

    console.log(moment(new Date(startDate)).format("YYYY-MM-DD"));

    dispatchFn({
      contractId,
      deliveryScheduleId,
      // startDate: moment(startDate, dateFormat).format("YYYY-MM-DD"),
      // endDate: moment(endDate, dateFormat).format("YYYY-MM-DD"),

      startDate: moment(new Date(startDate)).format("YYYY-MM-DD"),
      endDate: moment(new Date(endDate)).format("YYYY-MM-DD"),
    });
  };

  useEffect(() => {
    if (isError && apiError) {
      toast({
        status: "error",
        description: apiError.data.message,
      });
    }

    if (isSuccess) {
      toast({
        status: "success",
        description: "Dispatched successfully!",
      });

      onSuccess();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiError, isError, isSuccess]);

  const StartDate = forwardRef(({ value, onClick }, ref) => (
    <Input
      onClick={onClick}
      ref={ref}
      placeholder="Start date"
      value={value}
      readOnly
      rightIcon={<CalendarIcon />}
    />
  ));

  const EndDate = forwardRef(({ value, onClick }, ref) => (
    <Input
      onClick={onClick}
      ref={ref}
      placeholder="End date"
      value={value}
      readOnly
      rightIcon={<CalendarIcon />}
    />
  ));

  return (
    <BaseModal
      title="Delivery Details"
      subtitle="Delivery information"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box my="0">
          <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
            Delivery Address{" "}
            <Text as={"span"} color={"red"}>
              *
            </Text>
          </Text>
          <Controller
            name="address"
            defaultValue=""
            control={control}
            render={({ field: { onChange, value } }) => (
              <Box>
                <Input
                  isDisabled
                  type={"text"}
                  value={value}
                  onChange={onChange}
                  placeholder="450, Herbert Macaulay Way, Yaba, Lagos, Nigeria"
                  leftIcon={<LocationIcon />}
                />
                <div style={{ color: "red" }}>
                  {errors["address"] ? errors["address"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Box my="24px">
          <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
            Contact Number
            <Text as={"span"} color={"red"}>
              *
            </Text>
          </Text>
          <Controller
            name="phone"
            defaultValue=""
            control={control}
            render={({ field: { value } }) => (
              <Box>
                <InputPhone
                  type={"text"}
                  value={value}
                  // onChange={onChange}
                  placeholder="+234 803 3333333"
                  leftIcon={<FaUser />}
                  disabled
                />
                <div style={{ color: "red" }}>
                  {errors["phone"] ? errors["phone"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>

        <Box my={"24px"}>
          <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
            Delivery Date{" "}
            <Text as={"span"} color={"red"}>
              *
            </Text>
          </Text>
          <Grid templateColumns={"1fr 1fr"} gap={"16px"}>
            <GridItem>
              <Box my="0">
                <Controller
                  name="startDate"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <DatePicker
                        selected={value}
                        onChange={onChange}
                        minDate={new Date()}
                        customInput={<StartDate />}
                        wrapperClassName="datepicker_width"
                        showMonthDropdown
                        showYearDropdown
                        dateFormat={"dd-MM-yyyy"}
                      />
                      <div style={{ color: "red" }}>
                        {errors["startDate"]
                          ? errors["startDate"]?.message
                          : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>
            </GridItem>

            <GridItem>
              <Box my="0">
                <Controller
                  name="endDate"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <DatePicker
                        selected={value}
                        onChange={onChange}
                        minDate={new Date()}
                        customInput={<EndDate />}
                        wrapperClassName="datepicker_width"
                        showMonthDropdown
                        showYearDropdown
                        dateFormat={"dd-MM-yyyy"}
                      />
                      <div style={{ color: "red" }}>
                        {errors["endDate"] ? errors["endDate"]?.message : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>
            </GridItem>
          </Grid>
        </Box>

        <Box mt={"40px"}>
          <Button isSubmit full isLoading={isLoading}>
            Save
          </Button>
        </Box>
      </form>
    </BaseModal>
  );
};

export default DispatchTimeModal;
