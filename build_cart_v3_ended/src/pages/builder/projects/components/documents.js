import {
  Box,
  CircularProgress,
  Flex,
  SimpleGrid,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import Button from "../../../../components/Button";
import Input from "../../../../components/Input";
import { RiSearch2Line } from "react-icons/ri";
import EmptyState from "../../../../components/EmptyState";
import FileCards from "../../../../components/Cards/FileCards";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { imageHandler } from "../../../../utility/queries";
import { useParams } from "react-router-dom/cjs/react-router-dom";
import instance from "../../../../utility/webservices";
import { getFileExtension, handleError } from "../../../../utility/helpers";
import BaseModal from "../../../../components/Modals/Modal";
import useModalHandler from "../../../../components/Modals/SuccessModal";
import { lowerCase, upperCase } from "lodash";
import TruncateText from "../../../../components/Truncate";

const Documents = ({ data, getProjectDetails, owner, userType }) => {
  const { handleSuccessModal, ModalComponent } = useModalHandler();
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [uploadProgress, setUploadProgress] = useState([]);
  const [upload, setUpload] = useState([]);
  const [error, setError] = useState(false);
  const [borderColor, setBorderColor] = useState("#999999");
  const { projectId } = useParams();
  const [files, setFiles] = useState([
    { name: "Name of the Artifact", fileType: "PDF", type: "pdf" },
    { name: "Name of the Artifact", fileType: "Power Point", type: "ppt" },
    { name: "Name of the Artifact", fileType: "Excel", type: "excel" },
    { name: "Name of the Artifact", fileType: "Word", type: "word" },
    { name: "Name of the Artifact", fileType: "PNG", type: "img" },
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const allDocuments = useMemo(() => {
    const result = data?.map((e) => {
      const ext = getFileExtension(e?.url) ?? e?.mediaType;
      return {
        name: e?.title,
        src: e?.url,
        fileType: upperCase(ext),
        type: lowerCase(ext),
        id: e?.id,
      };
    });
    return result;
  }, [data]);

  const onSubmit = async (e) => {
    if (upload?.length < 1) {
      return setError(true);
    }
    setLoading(true);
    const payload = {
      url: upload[0].url,
      title: e?.title,
      mediaType: "FILE",
      description: "This is a media file uploaded by builder.",
      ProjectId: projectId,
    };

    try {
      await instance.post(
        `/builder/project/media?FILE=FILE&projectId=${projectId}`,
        payload
      );

      handleSuccessModal("Document added successfully");
      getProjectDetails(2);
      resetAll();
      setLoading(false);
    } catch (error) {
      getProjectDetails(2);
      handleError(error);
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const progressCallback = (progress) => {
        setUploadProgress([progress]);
      };
      const uploads = await imageHandler(e.target.files, progressCallback);

      uploads?.length > 0 && setUpload(uploads);
      setError(false);
    } catch (error) {
      console.log(error);
    }
  };

  const resetAll = () => {
    reset();
    onClose();
    setUpload([]);
    setUploadProgress([]);
    setError(false);
  };

  const [isBetween992and1200] = useMediaQuery(
    "(min-width: 992px) and (max-width: 1200px)"
  );

  return (
    <Box mt="20px">
      <Flex
        direction={["column", "column", "row"]}
        justifyContent={["space-between"]}
        alignItems={["flex-start", "flex-start", "flex-end"]}
        gap={2}
      >
        <Box>
          <Flex fontWeight="600" fontSize="24px">
            <Text color="primary" mr="5px">
              Documents
            </Text>
          </Flex>
          <Text fontSize="14px">
            Add documents relevant to your project like project plan, letter of
            charter, etc
          </Text>
          {allDocuments?.length > 0 && (
            <Flex gap={"1rem"} mt={3} maxW="350px">
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<RiSearch2Line />}
              />
            </Flex>
          )}
        </Box>
        <Button onClick={onOpen}>Add Document</Button>
      </Flex>

      {allDocuments?.length > 0 ? (
        <Box my={10}>
          <SimpleGrid columns={[1, 2, 3, isBetween992and1200 ? 3 : 5]} gap={5}>
            {allDocuments.map((file, index) => (
              <FileCards
                file={file}
                key={index}
                owner={owner}
                getProjectDetails={getProjectDetails}
              />
            ))}
          </SimpleGrid>
        </Box>
      ) : (
        <EmptyState>
          No Document has been uploaded yet.
          <Text as="span" color="secondary">
            {" "}
            Upload Now
          </Text>{" "}
        </EmptyState>
      )}

      <BaseModal
        isOpen={isOpen}
        onClose={resetAll}
        reset={reset}
        size="xl"
        title="Document"
        subtitle="Create documents for your project"
      >
        <Box fontSize="14px" mb="20px">
          <Box my={"10px"}>
            <Controller
              control={control}
              defaultValue=""
              name="title"
              render={({ field: { onChange, value } }) => (
                <Box w={"100%"}>
                  <Input
                    label="Document title"
                    isRequired
                    placeholder="Name of file"
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
            <Text
              as="label"
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
              _hover={{ background: "#F5862E29" }}
              htmlFor="uploadfiles"
              onMouseEnter={() => setBorderColor("#F5862E")}
              onMouseLeave={() => setBorderColor("#999999")}
            >
              <Text fontSize="16px" color="#677287">
                Click to upload your document
              </Text>
              <Flex align="center" gap={2}>
                <Text color="info" textAlign="right">
                  <TruncateText innerWidth="200px">
                    {upload[0]?.name}
                  </TruncateText>
                </Text>
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
                  onChange={(e) => handleImageUpload(e)}
                  hidden
                />
              </Flex>
            </Text>

            {error && upload?.length < 1 && (
              <Text color="red">Kindly choose a document to upload.</Text>
            )}
          </Box>
        </Box>

        <Button
          mb={10}
          isLoading={isLoading}
          full
          onClick={handleSubmit(onSubmit)}
          mr={3}
        >
          Add Document
        </Button>
      </BaseModal>

      {ModalComponent}
    </Box>
  );
};

export default Documents;
