import {
  Box,
  CircularProgress,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Input from "../../../../components/Input";
import Button from "../../../../components/Button";
import { IoIosArrowForward } from "react-icons/io";
import { RiSearch2Line } from "react-icons/ri";
import BaseTable from "../../../../components/Table";
import BaseModal from "../../../../components/Modals/Modal";
import { FaCloudUploadAlt } from "react-icons/fa";
import MaterialScheduleFile from "../../../../assets/files/materials.csv";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { imageHandler } from "../../../../utility/queries";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import instance from "../../../../utility/webservices";
import { handleError, handleSuccess } from "../../../../utility/helpers";
import EmptyState from "../../../../components/EmptyState";
import CreateRfq from "../modals/createRfq";

const MaterialSchedule = ({ setDefaultIndex, details }) => {
  const [uploadProgress, setUploadProgress] = useState([]);
  const [upload, setUpload] = useState([]);
  const [uploadFile, setUploadFile] = useState({});
  const [materialList, setMaterialList] = useState({});
  const [error, setError] = useState(false);
  const [tableBody, setTableBody] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [borderColor, setBorderColor] = useState("#999999");
  const { projectId } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenRfq,
    onOpen: onOpenRfq,
    onClose: onCloseRfq,
  } = useDisclosure();
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const getTableData = async () => {
    try {
      const { data } = (
        await instance.get(`/builder/material-schedule/${projectId}?page=1`)
      ).data;

      const arr = [];
      let counter = 1;
      data.forEach((element, index) => {
        element?.userUploadMaterial.forEach((item, i) => {
          arr.push({
            SN: `0${counter}`,
            materialName: item?.name,
            description: item?.description,
            category: item?.category,
            budget: new Intl.NumberFormat().format(item?.budget),
            action: (
              <Flex
                onClick={() => {
                  onOpenRfq();
                  setMaterialList({
                    ...item,
                    materialSchedule: element?.title,
                  });
                }}
                align="center"
                cursor="pointer"
                color="#12355A"
              >
                Create Request for Quote <IoIosArrowForward />
              </Flex>
            ),
            id: item?.id,
          });
          counter++;
        });
      });

      setTableBody(arr);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableColumn = [
    "S/N",
    "MATERIAL NAME",
    "DESCRIPTION",
    "CATEGORY",
    "BUDGET (₦)",
    "ACTION",
  ];

  const schema = yup.object({
    title: yup.string().required("Title is required"),
  });

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

    const payload = new FormData();
    payload.append("materialSchedule", upload[0]?.file);
    // payload.append("materialSchedule", uploadFile);
    payload.append("title", e?.title);
    payload.append("csvUrl", upload[0]?.url);
    payload.append("ownerId", user?.id);
    payload.append("ProjectId", projectId);

    try {
      await instance.post("/builder/material-schedule-upload", payload);

      handleSuccess("Material Schedule has been uploaded");
      getTableData();
      onClose();
      resetAll();
    } catch (error) {
      handleError(error);
    }
  };

  const handleDownload = () => {
    const fileUrl = MaterialScheduleFile;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "material-schedule.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImageUpload = async (e) => {
    setUploadFile(e.target.files[0]);
    const progressCallback = (progress) => {
      setUploadProgress([progress]);
    };
    const uploads = await imageHandler(e.target.files, progressCallback);

    setUpload(uploads);
  };

  const resetAll = () => {
    reset();
    setUpload([]);
    setUploadFile({});
    setUploadProgress([]);
    setError(false);
  };

  return (
    <Box mt="20px">
      <Flex fontWeight="600" fontSize="24px">
        <Text color="primary" mr="5px">
          Material
        </Text>
        <Text color="secondary"> Schedule</Text>
      </Flex>

      <Flex
        direction={["column", "column", "row"]}
        justifyContent={["space-between"]}
        alignItems={["flex-start", "flex-start", "flex-end"]}
        gap={2}
      >
        <Box>
          <Text mb="10px" fontSize="14px">
            Upload and manage your Material Schedule here.
          </Text>
          <Box width={["100%", "100%", "300px"]}>
            <Input leftIcon={<RiSearch2Line />} placeholder="Search" />
          </Box>
        </Box>
        <Button onClick={onOpen}>Upload Material Schedule</Button>
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
                  Material Schedule
                </Text>{" "}
                has been added to this project
              </Text>
            </EmptyState>
          }
        />
      </Box>

      {/* Upload Material Schedule Modal */}

      <BaseModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetAll();
        }}
        title="Material Schedule Upload"
        subtitle="Upload material schedule for your project"
      >
        <Box>
          <Text textAlign="center" my="20px">
            Download sample material schedule, fill and upload
          </Text>
          <Button full variant onClick={handleDownload}>
            Download Sample Material Schedule
          </Button>
        </Box>
        <Flex my="20px" alignContent={"center"} alignItems={"center"}>
          <Box w={"45%"}>
            <hr />
          </Box>
          <Text color={"#303030"} mx="20px">
            Or
          </Text>
          <Box w={"45%"}>
            <hr />
          </Box>
        </Flex>
        <Box>
          <Text textAlign="center" my="20px">
            Upload material schedule, if you already have the CutStruct format
          </Text>
        </Box>
        <Box fontSize="14px" mt="40px" mb="20px">
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

        <Button mb={10} full onClick={handleSubmit(onSubmit)} mr={3}>
          Upload Material Schedule
        </Button>
      </BaseModal>

      {/* Create RFQ Modal */}
      <BaseModal
        isOpen={isOpenRfq}
        onClose={() => {
          onCloseRfq();
          reset();
        }}
        title="Request For Quote"
        subtitle="Create an RFQ for your project"
        size="xl"
      >
        <CreateRfq
          onclose={onCloseRfq}
          materialList={materialList}
          setDefaultIndex={setDefaultIndex}
          details={details}
        />
      </BaseModal>
    </Box>
  );
};

export default MaterialSchedule;
