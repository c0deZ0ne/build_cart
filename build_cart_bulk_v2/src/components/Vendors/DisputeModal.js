import { Box, Button as ChakraButton, Text } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaCloudUploadAlt } from "react-icons/fa";
import * as yup from "yup";
import Button from "../Button";
import Input, { TextArea } from "../Input";
import BaseModal from "../Modals/Modal";
import CustomRadioGroup from "../RadioSelect";
import SuccessMessage from "../SuccessMessage";

/**
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {({reason, message, file}: {reason: string, message: string, file?: File}) => void} props.onSubmit
 * @param {boolean} props.isLoading
 * @param {boolean} props.isSuccess
 * @returns
 */
const DisputeModal = ({
  isOpen,
  onClose,
  onSubmit,
  userType = "Builder/customer",
  isLoading,
  isSuccess,
}) => {
  // const reasons = [
  //   { label: "Reason1", value: "Reason1" },
  //   { label: "Reason2", value: "Reason2" },
  // ];

  const formSchema = yup.object({
    wantToOpen: yup.string(),
    haveContacted: yup.string(),
    reason: yup.string().required("Tell us your reason"),
    message: yup.string().required("Explain ..."),
  });

  const [showRest, setShowRest] = useState(false);

  const [file, setFile] = useState();

  function handleFileChange(e) {
    const files = e.target.files;

    if (files && files.length) {
      setFile(files[0]);
    }
  }

  const methods = useForm({
    defaultValues: {
      wantToOpen: "",
      haveContacted: "",
      reason: "",
      message: "",
    },
    resolver: yupResolver(formSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = methods;

  async function submit(data) {
    const dataObject = {
      reason: data.reason,
      message: data.message,
    };

    if (file) {
      dataObject.file = file;
    }

    onSubmit(dataObject);
  }

  useEffect(() => {
    const subscription = watch(({ wantToOpen }) => {
      if (wantToOpen === "Yes") {
        setShowRest(true);
      }
      if (wantToOpen === "No") {
        setShowRest(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const filePickerRef = useRef();

  function toggleFilePicker() {
    filePickerRef.current.click();
  }

  return (
    <BaseModal
      onClose={onClose}
      isOpen={isOpen}
      title={"Dispute"}
      subtitle={"Open a dispute resolution"}
      showHeader={!isSuccess}
    >
      {isSuccess ? (
        <SuccessMessage
          message={
            "Dispute Opened! An Admin has been notified and the dispute will be attended to shortly."
          }
        />
      ) : (
        <form onSubmit={handleSubmit(submit)}>
          <Box my="20px">
            <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
              Are you sure you want to open a dispute?
              <Text as={"span"} color={"red"}>
                *
              </Text>
            </Text>
            <Controller
              name="wantToOpen"
              defaultValue=""
              control={control}
              render={({ field: { onChange, value } }) => (
                <Box>
                  <CustomRadioGroup
                    defaultValue="No"
                    options={["Yes", "No"]}
                    name="wantToOpen"
                    onChange={(v) => {
                      value = v;
                      onChange(v);
                    }}
                  />
                  <div style={{ color: "red" }}>
                    {errors["wantToOpen"] ? errors["wantToOpen"]?.message : ""}
                  </div>
                </Box>
              )}
            />
          </Box>

          {showRest && (
            <React.Fragment>
              <Box my="20px">
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Have you contacted the {userType}?
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>
                <Controller
                  name="haveContacted"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <CustomRadioGroup
                        options={["Yes", "No"]}
                        name="haveContacted"
                        onChange={(v) => {
                          value = v;
                          onChange(v);
                        }}
                      />
                      <div style={{ color: "red" }}>
                        {errors["haveContacted"]
                          ? errors["haveContacted"]?.message
                          : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>

              <Box mt="24px">
                <Text color={"#333"} fontSize={"14px"} mb={"8px"}>
                  Dispute Reason
                  <Text as={"span"} color={"red"}>
                    *
                  </Text>
                </Text>
              </Box>

              <Box>
                <Controller
                  name="reason"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <Input
                        placeholder="Title"
                        onChange={onChange}
                        value={value}
                      />
                      <div style={{ color: "red" }}>
                        {errors["reason"] ? errors["reason"]?.message : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>

              <Box mt={"16px"}>
                <Controller
                  name="message"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Box>
                      <TextArea
                        h={"160px"}
                        placeholder="Description"
                        onChange={onChange}
                        value={value}
                      />
                      <div style={{ color: "red" }}>
                        {errors["message"] ? errors["message"]?.message : ""}
                      </div>
                    </Box>
                  )}
                />
              </Box>

              <Box mt={"20px"}>
                <ChakraButton
                  fontWeight={"400"}
                  height={"56px"}
                  w={"100%"}
                  rightIcon={<FaCloudUploadAlt />}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  borderRadius={"8px"}
                  backgroundColor={"transparent"}
                  border={"1px solid #999999"}
                  color={"#999999"}
                  onClick={toggleFilePicker}
                >
                  <input
                    type="file"
                    accept="images"
                    ref={filePickerRef}
                    hidden
                    onChange={handleFileChange}
                  />
                  <Text as="span">
                    {file ? file.name : "Click to attach file"}
                  </Text>
                </ChakraButton>
              </Box>
            </React.Fragment>
          )}

          <Box mt={"40px"}>
            <Button full isSubmit disabled={!showRest} isLoading={isLoading}>
              Open Dispute
            </Button>
          </Box>
        </form>
      )}
    </BaseModal>
  );
};

export default DisputeModal;
