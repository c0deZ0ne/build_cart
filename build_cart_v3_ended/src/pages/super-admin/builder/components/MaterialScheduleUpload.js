import { Box, CircularProgress, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import BaseModal from "../../../../components/Modals/Modal";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { imageHandler } from "../../../../utility/queries";
import instance from "../../../../utility/webservices";
import { handleError, handleSuccess } from "../../../../utility/helpers";
import CustomSelect from "../../../../components/CustomSelect/CustomSelect";

export default function MaterialScheduleUpload({
  isOpen,
  onClose,
  builderId,
  projectOpt,
}) {
  const [uploadProgress, setUploadProgress] = useState([]);
  const [upload, setUpload] = useState([]);
  const [uploadFile, setUploadFile] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [borderColor, setBorderColor] = useState("#999999");

  const schema = yup.object({
    title: yup.string().required("Title is required"),
    projectTitle: yup.object().required("Project title is required"),
  });

  const resetAll = () => {
    reset();
    setUpload([]);
    setUploadFile({});
    setUploadProgress([]);
    setError(false);
  };

  const methods = useForm({
    defaultValues: {
      title: "",
    },
    resolver: yupResolver(schema),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = async (e) => {
    if (upload?.length < 1) {
      return setError(true);
    }
    setIsLoading(true);

    const payload = new FormData();
    payload.append("materialSchedule", upload[0]?.file);
    // payload.append("materialSchedule", uploadFile);
    payload.append("title", e?.title);
    payload.append("csvUrl", upload[0]?.url);
    payload.append("ownerId", builderId);
    payload.append("ProjectId", e?.projectTitle?.value);

    try {
      await instance.post(
        "/superAdmin/builder/material-schedule-upload",
        payload
      );

      handleSuccess("Material Schedule has been uploaded");
      onClose();
      resetAll();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    setUploadFile(e.target.files[0]);
    const progressCallback = (progress) => {
      setUploadProgress([progress]);
    };
    const uploads = await imageHandler(e.target.files, progressCallback);

    setUpload(uploads);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        resetAll();
      }}
      title="Material Schedule Upload"
      subtitle="Upload material schedule for your project"
    >
      <Box fontSize="14px" mb="20px">
        <Box mb={"24px"}>
          <Controller
            control={control}
            defaultValue=""
            name="projectTitle"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <CustomSelect
                  placeholder="Project title"
                  label="Project Title"
                  onChange={onChange}
                  value={value}
                  options={projectOpt}
                  isRequired
                />
                <div style={{ color: "red" }}>
                  {errors["projectTitle"]
                    ? errors["projectTitle"]?.message
                    : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Box my={"10px"}>
          <Text>
            Document title <span style={{ color: "red" }}>*</span>
          </Text>
          <Controller
            control={control}
            defaultValue=""
            name="title"
            render={({ field: { onChange, value } }) => (
              <Box w={"100%"}>
                <Input
                  placeholder="Sharp sand material schedule"
                  value={value}
                  onChange={onChange}
                />
                <div style={{ color: "red" }}>
                  {errors["title"] ? errors["title"]?.message : ""}
                </div>
              </Box>
            )}
          />
        </Box>
        <Box my="20px">
          <Text>
            Document upload <span style={{ color: "red" }}>*</span>
          </Text>
          <label
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: "8px",
              border: `1px solid ${borderColor}`,
              padding: "11px 16px",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "14px",
              width: "100%",
            }}
            htmlFor="uploadfiles"
            onMouseEnter={() => setBorderColor("#F5862E")}
            onMouseLeave={() => setBorderColor("#999999")}
          >
            <Text fontSize="16px" color="#677287">
              Click to upload your document
            </Text>
            <Flex align="center" gap={2}>
              <Text color="info">{upload[0]?.name || uploadFile?.name}</Text>
              <Box>
                {uploadProgress[0] !== 100 && (
                  <CircularProgress
                    value={uploadProgress[0]}
                    size="20px"
                    color="primary"
                  />
                )}
              </Box>
              <FaCloudUploadAlt fill="#999999" fontSize="1.2em" />
              <input
                type="file"
                name="upload"
                id="uploadfiles"
                accept={
                  ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                }
                onChange={(e) => handleImageUpload(e)}
                hidden
              />
            </Flex>
          </label>

          {error && upload.length < 1 && (
            <Text color="red">Material schedule document is required.</Text>
          )}
        </Box>
      </Box>

      <Button
        mb={10}
        full
        onClick={handleSubmit(onSubmit)}
        mr={3}
        isLoading={isLoading}
      >
        Upload Material Schedule
      </Button>
    </BaseModal>
  );
}
