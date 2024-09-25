import { FaImage } from "react-icons/fa6";
import { HStack, Text, VStack } from "@chakra-ui/react";
import React, { useState } from "react";

export default function CutUploadFileButton({
  text,
  caption,
  title,
  accept,
  onFileSelected,
}) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Update the state with the selected file
    setSelectedFile(file);
    onFileSelected(file);
  };

  return (
    <VStack align="start" cursor="pointer">
      {title ? (
        <Text fontSize="14px" color="neutral3">
          {title || ""}
        </Text>
      ) : (
        ""
      )}

      <label style={{ cursor: "pointer" }}>
        <input
          type="file"
          onChange={handleFileChange}
          hidden={true}
          accept={accept ?? ""}
        />
        <HStack
          spacing="10px"
          align="center"
          px="80px"
          py="10px"
          borderRadius="5px"
          border="1px"
          borderStyle="dashed"
          borderColor="secondary"
        >
          <FaImage color="neutral1" />
          <Text color="neutral3"> {text ? text : "Click to upload"}</Text>
        </HStack>
      </label>
      {selectedFile && <p>Selected File: {selectedFile.name}</p>}
      <Text fontSize="12px" color="neutral3">
        {caption || ""}
      </Text>
    </VStack>
  );
}
