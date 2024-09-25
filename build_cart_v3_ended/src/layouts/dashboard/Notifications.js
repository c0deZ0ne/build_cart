import {
  Avatar,
  Badge,
  Box,
  Divider,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { MdNotifications } from "react-icons/md";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";

export default function Notifications() {
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNotification = async () => {
    setNotification([]);
  };

  const markAsRead = async () => {
    setLoading(true);
  };

  useEffect(() => {
    getNotification();
  }, []);

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Box pos="relative">
          <IconButton
            size="lg"
            variant="ghost"
            aria-label="open menu"
            icon={<MdNotifications size={26} />}
            rounded={"full"}
          />
          {notification?.length > 0 ? (
            <Badge
              bg={"red.red500"}
              color="#fff"
              rounded={"full"}
              pos="absolute"
              right={"2"}
              top={"2"}
            >
              {notification?.length}
            </Badge>
          ) : (
            ""
          )}
        </Box>
      </PopoverTrigger>
      <PopoverContent
        bg="#fff"
        w={{ base: "360px", md: "500px" }}
        maxHeight={"200px"}
        overflowY={"auto"}
      >
        <PopoverArrow bg={"#fff"} />
        <PopoverCloseButton />
        <PopoverHeader>
          <SimpleGrid textAlign={"center"} columns={2}>
            <Text fontSize={"12px"}>Notifications</Text>
            <Text fontSize={"12px"} cursor={"pointer"} onClick={markAsRead}>
              {loading ? "Loading..." : "Mark all as read"}
            </Text>
          </SimpleGrid>
        </PopoverHeader>
        <PopoverBody>
          <Stack spacing={"10px"}>
            {notification?.map((item, index) => (
              <Box key={index}>
                <HStack w="100%" as={Link} to={item.url} spacing={"20px"}>
                  <Avatar src={item.sender_id?.individual?.picture} />
                  <Box>
                    <Text>
                      {item.sender_id?.user_mode === "individual"
                        ? item.sender_id?.username
                        : item.sender_id?.company?.name}
                      {" " + item?.message}
                    </Text>
                    <Text fontSize={"10px"}>
                      <ReactTimeAgo date={item.created_at} locale="en-US" />
                    </Text>
                  </Box>
                </HStack>
                <Divider />
              </Box>
            ))}

            {notification?.length < 1 ? <Text>No notification</Text> : ""}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
