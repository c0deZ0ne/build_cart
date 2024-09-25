import { Flex, Spacer, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import { FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import { addTransparency } from "../../../utility/helpers";
import GalleryEdit from "../../Icons/GalleryEdit";

/**
 *
 * @param {{fileName: string, fileSize: number, removeFile: Function, progress: number, isLoading: boolean, isComplete: boolean}} Props
 * @returns
 */
const FileListForUpload = ({
  fileName,
  fileSize,
  removeFile,
  progress,
  isLoading,
  isComplete,
}) => {
  return (
    <Flex
      height={"40px"}
      p={"8px 16px"}
      alignItems={"center"}
      backgroundColor={addTransparency("#12355A", 0.04)}
      border={"0.1px solid"}
      borderColor={addTransparency("#999999", 0.2)}
      borderRadius={"4px"}
    >
      <GalleryEdit></GalleryEdit>
      <Text
        color={"primary"}
        fontSize={"12px"}
        ml={"8px"}
        whiteSpace={"nowrap"}
        overflow={"hidden"}
        textOverflow={"ellipsis"}
      >
        {fileName}
      </Text>
      <Spacer />
      {isLoading && (
        <>
          <Text fontSize={"8px"} color={"neutral3"} whiteSpace={"nowrap"}>
            {(progress / 1000).toFixed(2)}kb of {(fileSize / 1000).toFixed(2)}kb
          </Text>
          <Spinner
            thickness="4px"
            height={"28px"}
            width={"28px"}
            color="#12355a"
            emptyColor={addTransparency("#12335a", 0.16)}
            mx={"16px"}
          />
        </>
      )}
      {isComplete && (
        <Text fontSize={"8px"} color={"neutral3"} mx={"16px"}>
          {(fileSize / 1000).toFixed(2)}kb
        </Text>
      )}

      {!isComplete && (
        <button onClick={removeFile}>
          <FaTimesCircle fill="#999999" />
        </button>
      )}
      {isComplete && (
        <button>
          <FaTrashAlt fill="#999999" />
        </button>
      )}
    </Flex>
  );
};

export default FileListForUpload;
