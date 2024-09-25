import { Box, Grid, Text, VStack, useToast } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import DocNamePicker from "../../../components/Builder/ProjectInvitations/DocNamePicker";
import TargetBox from "../../../components/Builder/ProjectInvitations/TargetBox";
import Button from "../../../components/Button";
import BaseModal from "../../../components/Modals/Modal";
import { useBidOnAProjectMutation } from "../../../redux/api/builder/builder";
import { uploadImage } from "../../../utility/queries";
import FileListForUpload from "./FileListForUpload";

/**
 * @typedef {Object} DocData
 * @property {File} file
 * @property {string} uploadUrl
 * @property {string} name
 * @property {number} progress
 * @property {boolean} isLoading
 * @property {boolean} isComplete
 */

const ProjectTenderModal = ({
  isOpen,
  onClose,
  projectId,
  projectTenderId,
}) => {
  const toast = useToast();

  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [
    bidOnAProjectFn,
    { isLoading: isSubmitting, isSuccess, isError, error },
  ] = useBidOnAProjectMutation();

  useEffect(() => {
    if (!isSuccess) return;
    toast({
      description: "Bid has been made!",
      status: "success",
    });

    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (!isError) return;
    if (!error) return;

    toast({
      description: error.data.message,
      status: "error",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError]);

  /**
   * @type {[DocData[], React.Dispatch<React.SetStateAction<DocData>>]} Tuple containing the state variable and its setter function.
   */
  const [documentFiles, setDocumentFiles] = useState([]);
  const [docNames, setDocNames] = useState([]);

  const handleFileDrop = useCallback(
    (item) => {
      if (item) {
        /**
         * @type {File[]}
         */
        const files = item.files;

        /**
         * @type {DocData[]}
         */
        const mapped = Array.from(files).map((file) => ({
          file,
          uploadUrl: "",
          name: "",
          progress: 0,
          isLoading: false,
          isComplete: false,
        }));
        setDocumentFiles(documentFiles.concat(...mapped));
      }
    },
    [documentFiles]
  );

  /**
   *
   * @param {string} name
   * @param {number} idx
   */
  function handleNameChange(name, idx) {
    const docsCopy = [...documentFiles];
    docsCopy[idx].name = name;

    setDocumentFiles(docsCopy);
  }

  function removeFile(idx) {
    const filesCopy = [...documentFiles];
    const docNamesCopy = [...docNames];

    filesCopy.splice(idx, 1);
    docNamesCopy.splice(idx, 1);

    setDocumentFiles(filesCopy);
    setDocNames(docNamesCopy);
  }

  /**
   *
   * @param {string} url
   * @param {number} idx
   */
  function handleComplete(url, idx) {
    const copyOfDocData = [...documentFiles];
    copyOfDocData[idx].uploadUrl = url;

    setDocumentFiles(copyOfDocData);
  }

  /**
   *
   * @param {number} idx
   * @param {number} progress
   * @param {boolean} loading
   * @param {boolean} complete
   */
  function handleUploading(idx, progress, loading, complete) {
    setDocumentFiles((prevState) => {
      /**
       * @type {DocData[]}
       */
      const copyOfDocData = [...prevState];
      copyOfDocData[idx].progress = progress;
      copyOfDocData[idx].isLoading = loading;
      copyOfDocData[idx].isComplete = complete;

      return copyOfDocData;
    });
  }

  /**
   *
   * @param {File} file
   * @param {number} idx
   * @returns
   */
  async function uploadIt(file, idx) {
    const { url } = await uploadImage(file, "", (prog) => {
      if (prog !== undefined) {
        handleUploading(idx, (prog / 100) * file.size, true, false);
      }
    });
    handleUploading(idx, file.size / 1000, false, true);
    handleComplete(url, idx);
    return url;
  }

  async function submit() {
    if (documentFiles.some((doc) => doc.name.trim() === "")) {
      return toast({
        description: "Please assign every document a name",
        status: "error",
      });
    }

    try {
      setIsUploadingFiles(true);
      const mappedRequest = documentFiles.map((docFile, index) => {
        return uploadIt(docFile.file, index);
      });

      await Promise.all(mappedRequest);

      const dataToSubmit = {
        description: "",
        documents: documentFiles.map((doc) => {
          return {
            title: doc.name,
            url: doc.uploadUrl,
            type: "FILE",
          };
        }),
        ProjectId: projectId,
        ProjectTenderId: projectTenderId,
      };

      bidOnAProjectFn(dataToSubmit);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploadingFiles(false);
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Project Tender"
      subtitle="Upload all relevant documents for a project"
    >
      <Box py="24px">
        <Text align={"center"} mb={"24px"} px={"3rem"}>
          Download the unpriced Bill of Quantity (BOQ), 3D drawing, and other
          documents for this project.
        </Text>

        <Button
          background="transparent"
          color="#12355A"
          full
          border="1px solid #12355A"
        >
          Download Project Documents.
        </Button>

        <Text mt={"40px"} align={"center"} px={"3rem"}>
          Upload your Priced Bill of Quantity (BOQ), as well as other documents
          required for this project.
        </Text>

        <Box mt="24px">
          <TargetBox onDrop={handleFileDrop} />
        </Box>

        <VStack spacing={"16px"} mt={"22px"}>
          {Array.from(documentFiles).map((docFile, idx) => {
            return (
              <Grid
                key={idx}
                alignItems={"center"}
                gap={"5%"}
                width={"100%"}
                templateColumns={"65% 30%"}
              >
                <Box flex={"1"}>
                  <FileListForUpload
                    key={docFile.name + idx}
                    fileName={docFile.file.name}
                    fileSize={docFile.file.size}
                    removeFile={() => removeFile(idx)}
                    isLoading={documentFiles[idx].isLoading}
                    isComplete={documentFiles[idx].isComplete}
                    progress={documentFiles[idx].progress}
                  />
                </Box>

                <DocNamePicker
                  pickedName={docFile.name}
                  onChange={(name) => handleNameChange(name, idx)}
                />
              </Grid>
            );
          })}
        </VStack>
        <Box mt={"29px"} onClick={submit}>
          <Button
            full
            isLoading={isUploadingFiles || isSubmitting}
            disabled={documentFiles.length < 1}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </BaseModal>
  );
};

export default ProjectTenderModal;
