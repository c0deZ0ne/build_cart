import {
  Box,
  Text,
  Heading,
  Flex,
  Image,
  Select,
  CircularProgress,
  Progress,
} from "@chakra-ui/react";
import { MdCancel } from "react-icons/md";
import React, { useState } from "react";
import Button from "../../components/Button";
import ImagePlaceholder from "../../assets/images/imgplaceholder.svg";
import DeleteIcon from "../../components/Icons/Delete";
import { imageHandler } from "../../utility/queries";

const VendorBusinessDocs = ({ setActiveStep }) => {
  const [documents, setDocuments] = useState([]);
  const [isUploading, setUploading] = useState(false);
  const [isSelectFileName, setSelectFileName] = useState([]);
  const [docProgress, setDocProgress] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const documentOptions = [
    {
      value: "certificateOfIncorporation",
      label: "Certificate of Incorporation",
    },
    { value: "businessContactId", label: "Business Contact ID" },
    { value: "businessContactSign", label: "Business Contact Signature" },
    { value: "UtilityBill", label: "Utility Bill" },
    { value: "other", label: "Other Documenet" },
  ];

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    setUploading(true);
    const originalDocs = [...documents];
    const docs = [...documents];
    const files = e?.dataTransfer?.files
      ? e?.dataTransfer?.files
      : e?.target?.files;

    for (let i = 0; i < files.length; i++) {
      docs.push({
        name: files[i]?.name,
        file: files[i],
        url: "",
        publicId: "",
      });
    }

    setDocuments(docs);

    const uploadfile = await imageHandler(files, handleUploadProgress);

    for (let i = 0; i < uploadfile.length; i++) {
      docs[originalDocs?.length + i].url = uploadfile[i]?.url;
      docs[originalDocs?.length + i].publicId = uploadfile[i]?.publicId;
    }

    setUploading(false);
    setDocuments(docs);
  };

  let arr = [...docProgress];
  const handleUploadProgress = (progress, fileLength) => {
    let ar = [...arr, progress];
    ar[fileLength] = progress;

    if (progress === 100) {
      arr.push(progress);
    }

    setDocProgress(ar);
  };

  const submitDocuments = (data) => {
    let err = [];
    for (let i = 0; i < documents.length; i++) {
      if (!documents[i]?.documentFilename) {
        err.push(true);
      } else {
        err.push(false);
      }
    }

    setSelectFileName(err);

    if (err.includes(true)) {
      return console.log("You need to select all files");
    }

    const storedData = JSON.parse(localStorage.getItem("vendorData"));
    storedData.documents = documents;

    const updatedDataString = JSON.stringify(storedData);
    localStorage.setItem("vendorData", updatedDataString);
    setActiveStep(3);
  };

  const handleDeleteDocument = (id) => {
    const docs = [...documents];

    const filteredDocs = docs.filter((e, i) => i !== id);
    const filteredProgress = docProgress.filter((e, i) => i !== id);

    setDocuments(filteredDocs);
    setDocProgress(filteredProgress);
  };

  const handleChooseDocument = (event, index) => {
    const docs = [...documents];
    docs[index].documentFilename = event.target.value;

    setDocuments(docs);
  };

  return (
    <div>
      <Box textAlign="center">
        <Heading color="#F5862E" m="20px 0 10px" fontSize={"24px"}>
          Business Documents
        </Heading>
        <Text color="info" fontSize="14px" mb="20px">
          To proceed, kindly provide the requested documents below.
        </Text>
      </Box>
      <Box width="100%" mb="30px">
        {documents.length < 5 ? (
          <label
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              display: "inline-block",
              border: `2px dashed ${dragging ? "green" : "#F5862E"}`,
              borderRadius: "7px",
              background: "#fef6ee",
              padding: "20px 5px",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "14px",
              width: "100%",
            }}
            htmlFor="uploadfiles"
          >
            <Text as={"span"} color="info">
              <Text as={"span"} color="secondary">
                Click here
              </Text>{" "}
              to upload or drag and drop your files here
            </Text>
            <input
              type="file"
              name="upload"
              multiple
              id="uploadfiles"
              accept={".pdf,image/*"}
              onChange={(e) => {
                handleDrop(e);
              }}
              hidden
            />
          </label>
        ) : (
          <>
            <label
              style={{
                display: "inline-block",
                border: `2px dashed ${dragging ? "green" : "#999999"}`,
                borderRadius: "7px",
                background: "#efefef",
                padding: "20px 5px",
                textAlign: "center",
                fontSize: "14px",
                width: "100%",
                cursor: "not-allowed",
              }}
              htmlFor="uploadfiles"
            >
              <Text as={"span"} color="info">
                <Text as={"span"} color="secondary">
                  Click here
                </Text>{" "}
                to upload or drag and drop your files here
              </Text>
            </label>
            <Text textAlign="center" color="#eb3232" mt={1} fontSize="14px">
              You can't upload more documents.
            </Text>
          </>
        )}
        {isUploading && (
          <Progress mt="2" colorScheme="orange" size="xs" isIndeterminate />
        )}
      </Box>
      <Box>
        {documents.length > 0 &&
          documents.map((e, i) => (
            <Flex
              justify="space-between"
              gap={2}
              my={2}
              alignItems="center"
              key={i}
            >
              <Flex
                alignItems="center"
                justify="space-between"
                p="8px"
                bg="#f2f3f6"
                fontSize="12px"
                gap={2}
                width="60%"
                rounded={"4px"}
              >
                <Box>
                  <Image src={ImagePlaceholder} alt="document1" />
                </Box>
                <Box w="200px" textOverflow="ellipsis">
                  <Text
                    w="130px"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                  >
                    {e?.name || "Certificate of incorporation"}
                  </Text>
                </Box>
                <Box>
                  {console.log(docProgress[i], i)}
                  {docProgress[i] !== 100 && (
                    <CircularProgress
                      value={docProgress[i]}
                      size="20px"
                      color="primary"
                    />
                  )}
                </Box>
                <Box
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(-1)}
                  cursor="pointer"
                >
                  {docProgress[i] !== 100 ? (
                    <MdCancel
                      color={hover === i ? "#eb3232" : "#999"}
                      fontSize="16px"
                      onClick={() => handleDeleteDocument(i)}
                    />
                  ) : (
                    <DeleteIcon
                      color={hover === i ? "#eb3232" : "#999"}
                      onClick={() => handleDeleteDocument(i)}
                    />
                  )}
                </Box>
              </Flex>
              <Box w="40%">
                <Select
                  placeholder="Select file name"
                  _focus={{ borderColor: "secondary" }}
                  fontSize="14px"
                  pl="0"
                  rounded={"4px"}
                  onChange={(e) => handleChooseDocument(e, i)}
                  value={e?.documentFilename}
                  border={
                    isSelectFileName[i] === true
                      ? "1px solid red"
                      : "1px solid #e5eaf2"
                  }
                >
                  {documentOptions.map((option, optionIndex) => (
                    <option value={option.value} key={optionIndex}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Box>
            </Flex>
          ))}
      </Box>

      <Flex mt="40px" justify="space-between" alignItems="center">
        <Text
          onClick={() => setActiveStep(3)}
          cursor="pointer"
          fontSize="15px"
          fontWeight="600"
        >
          Skip
        </Text>
        <Button disabled={isUploading} onClick={submitDocuments} width="250px">
          Save & Continue
        </Button>
      </Flex>
    </div>
  );
};

export default VendorBusinessDocs;
