import { Box, Image, Input, Text } from "@chakra-ui/react";
import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { FaImagePortrait } from "react-icons/fa6";
import GalleryEdit from "../../../../components/Icons/GalleryEdit";

/**
 *
 * @param {object} props
 * @param {Function} props.onDrop
 */
const DragAndDropBox = (props) => {
  const { onDrop } = props;
  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item) {
        if (onDrop) {
          onDrop(item);
        }
      },
      // canDrop(item) {
      //   console.log("canDrop", item.files, item.items);
      //   return true;
      // },
      // hover(item) {
      //   console.log("hover", item.files, item.items);
      // },
      collect: (monitor) => {
        const item = monitor.getItem();
        if (item) {
          console.log("collect", item.files, item.items);
        }
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [props]
  );
  const isActive = canDrop && isOver;

  const inputRef = useRef();

  function handleClick() {
    inputRef.current.click();
  }

  /**
   *
   * @param {Object} e
   * @param {HTMLInputElement} e.target
   * @returns
   */
  function handleChange(e) {
    console.log(e.target.files);
    const files = e.target.files;

    if (!files) return;

    onDrop({ files });
  }

  return (
    <Box
      ref={drop}
      backgroundColor="#FEF5EE"
      py={"1rem"}
      borderRadius={"0.5rem"}
      border="1px solid #f5852c"
      borderStyle={isActive ? "dashed" : "solid"}
      outline={isActive ? "4px dashed #f5852c" : ""}
      onClick={handleClick}
      height={"100%"}
      display={"flex"}
      alignItems={"center"}
    >
      <Box color="neutral3" fontSize={"14px"} align={"center"} p={"2rem"}>
        <Input
          type="file"
          hidden
          ref={inputRef}
          onChange={handleChange}
          accept="image/png, image/gif, image/jpeg"
        />

        <Box>
          <GalleryEdit height={"36px"} width={"36px"} />
          <Text as="span" fontWeight={600} color={"secondary"}>
            Click here{" "}
          </Text>
          to upload or drag and drop your files here
        </Box>
      </Box>
    </Box>
  );
};

export default DragAndDropBox;
