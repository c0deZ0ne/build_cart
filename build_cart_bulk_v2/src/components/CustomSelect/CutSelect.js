import {
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import React from "react";
import { FaAngleDown } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import TruncateText from "../Truncate";

const CutSelect = ({
  options,
  value,
  onChange,
  placeholder,
  padding = "5px",
  label,
  isRequired,
  isDisabled,
  isLoading,
}) => {
  const {
    isOpen: isOpenMenu,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  } = useDisclosure();
  return (
    <div>
      <Menu
        isOpen={isOpenMenu}
        onOpen={onOpenMenu}
        onClose={onCloseMenu}
        isLazy
        direction="ltr"
      >
        <MenuButton
          as={Flex}
          fontSize="16px"
          cursor="pointer"
          _hover={{
            border: "1px solid #c2c7ce",
          }}
          border="1px solid #999999"
          p="12px 10px"
          rounded={8}
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex justifyContent="space-between" alignItems="center">
            <TruncateText innerWidth="90%" outerWidth="95%">
              {value ? value : "Document Names"}
            </TruncateText>
            <FaAngleDown size={"16px"} />
          </Flex>
        </MenuButton>
        <MenuList>
          <Text px={5} fontWeight="600" color="secondary">
            Document Names
          </Text>
          <MenuDivider />

          {options?.map((e, i) => (
            <MenuItem
              justifyContent="space-between"
              alignItems="center"
              gap={4}
              key={i}
              onClick={() => onChange(e)}
            >
              <Text>{e}</Text>
              {value === e && (
                <IoCheckmarkCircle fontSize="17px" color="#f5852c" />
              )}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

export default CutSelect;
