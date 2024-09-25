import {
  Box,
  Flex,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
import { FaSquare } from "react-icons/fa";

export default function ReturnPolicy() {
  const topRef = useRef();
  const bottomRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const bottomPosition =
      bottomRef?.current?.getBoundingClientRect().bottom + window.scrollY;
    const isBottom = bottomPosition <= window.innerHeight;

    setIsAtBottom(isBottom);
  };

  window.addEventListener("scroll", handleScroll);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"4xl"}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottom="1px solid #999999" color={"#211F5C"}>
            RETURN, REFUNDS, AND CANCELLATION POLICY
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody onScroll={handleScroll}>
            <Stack id={"bottom-level"} ref={topRef}>
              <Text color={"#211F5C"} fontWeight={"bold"}>
                Introduction
              </Text>
              <Text as="div">
                This Return, Refund and Cancellation Policy is between Cutstruct
                Technology Limited (hereinafter referred to as “we”, “our”, “us”
                and “Company”) and you, a purchaser of items listed on our
                online marketplace via our website livevend.com (“Website”)
                (hereinafter referred to as “Customer”, “you”). This Policy
                covers the following: <br /> <br />
                <List ml={5} spacing={1}>
                  <ListItem>
                    <ListIcon as={FaSquare} color="#F5862E" />
                    Return Policy
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaSquare} color="#F5862E" />
                    Refunds
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaSquare} color="#F5862E" />
                    Cancellation Request
                  </ListItem>
                </List>
                <br />
                <Text color={"#211F5C"} fontWeight={"bold"}>
                  A. RETURN POLICY
                </Text>
                You can initiate a return or exchange of any item purchased on
                the Website. <br />
                You may return or exchange any item within a period not later
                than 24 [Twenty-Four] hours from the date of purchase, and upon
                the presentation of a valid receipt issued to you when you
                purchased the item. Please note that we are unable to accept a
                return of any items after a period of 24 [Twenty-Four] hours of
                purchase. <br /> <br />
                Any item proposed to be returned, must be returned in a
                re-saleable condition. This means that the item must be unused
                and in its original packaging, with all seals, tags, labels and
                accessories intact. Items not eligible for return include:
                <br /> <br />
                <List ml={5} spacing={1}>
                  <ListItem>
                    <ListIcon as={FaSquare} color="#F5862E" />
                    Items previously designated as “non-returnable”;
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaSquare} color="#F5862E" />
                    Items that are repackaged by you;
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaSquare} color="#F5862E" />
                    Items altered in any shape or form by the Customer;
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaSquare} color="#F5862E" />
                    Items that have been used by you;
                  </ListItem>
                  <ListItem>
                    <ListIcon as={FaSquare} color="#F5862E" />
                    Items damaged by you.
                  </ListItem>
                </List>{" "}
                <br /> <br />
                We shall endeavour to process your return request as soon as
                soon as possible. Accordingly, we offer a 24 [Twenty-Four] hours
                period to exchange any item that meets the requirements for
                return. However, the period of exchange may be extended where we
                are unable to process your request withith 24 [Twenty-Four]
                hours, and this will be communicated to you.
                <br />
                Note that this Return Policy contains distinct terms and
                conditions for different items which are as follows:
                <br />
                <br />
              </Text>
              <Text color={"#211F5C"} fontWeight={"bold"}>
                1. Damaged Items
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    1.1 We shall accept a return or exchange of damaged items
                    where:
                  </Text>{" "}
                </Text>
                <Box ml={3}>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      1.1.1
                    </Text>{" "}
                    The items were damaged in transit by us.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      1.1.2
                    </Text>{" "}
                    The items were damaged from the manufacturers.
                  </Text>
                </Box>
              </Box>
              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                2. Items Erroneously Ordered and Delivered
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.1
                  </Text>{" "}
                  Items erroneously ordered and delivered may be returned
                  provided that the Customer notifies us of the error within 24
                  [Twenty-Four] hours of the receipt of the delivery of the
                  order and we confirm receipt of such request to return.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.2
                  </Text>{" "}
                  You will be responsible for the return of items erroneously
                  ordered and delivered in a good condition
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.3
                  </Text>{" "}
                  To process the return, you will be required to forfeit the
                  delivery fee paid for logistics.
                </Text>
              </Box>
              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                3. Return and Exchange of Civil Items
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.1 We shall approve a return and exchange of civil items
                    where:
                  </Text>{" "}
                </Text>
                <Box ml={3}>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      3.1.1
                    </Text>{" "}
                    The items are damaged at or during delivery.
                  </Text>{" "}
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      3.1.2
                    </Text>{" "}
                    A wrong item is delivered, or the items delivered do not
                    meet the specifications ordered.
                  </Text>{" "}
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      3.1.3
                    </Text>{" "}
                    Defective items are delivered.
                  </Text>{" "}
                </Box>
              </Box>
              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                4. Return and Exchange of Electrical Items
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.1 We shall approve a return and exchange of electrical
                    items where:
                  </Text>
                </Text>
                <Text ml={3} as="div">
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      4.1.1
                    </Text>{" "}
                    The items are damaged at or during delivery.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      4.1.2
                    </Text>{" "}
                    Substandard items are delivered.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      4.1.3
                    </Text>{" "}
                    A wrong item is delivered, or the items delivered do not
                    meet the specification and/or grade ordered.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      4.1.4
                    </Text>{" "}
                    Defective Items are delivered.
                  </Text>
                </Text>
              </Box>
              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                5. Return and Exchange of Mechanical Items
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    5.1 We shall approve a return and exchange of mechanical
                    items where:
                  </Text>
                </Text>
                <Text ml={3} as="div">
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.1
                    </Text>{" "}
                    The items are damaged at or during delivery.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.2
                    </Text>{" "}
                    Substandard items are delivered.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.3
                    </Text>{" "}
                    A wrong item is delivered, or the items delivered do not
                    meet the specification and/or grade ordered.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.4
                    </Text>{" "}
                    Defective Items are delivered.
                  </Text>
                </Text>
              </Box>

              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                B. REFUND POLICY
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    1.
                  </Text>{" "}
                  The refund process begins after we have completed the
                  evaluation of your returned product. Accordingly, refunds will
                  only be possible in respect of approved returned goods.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.
                  </Text>{" "}
                  Once your refund claim is validated, we will proceed with the
                  refund, and endeavour to process the refund within 2 business
                  days.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.
                  </Text>{" "}
                  Please note that your refund will be processed directly into
                  the bank account which has been provided by you in furtherance
                  of the refund, and may take up to 2-3 business days before you
                  receive same.
                </Text>
              </Box>

              <br />
              <Text color={"#211F5C"} ref={bottomRef} fontWeight={"bold"}>
                C. CANCELLATION POLICY
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    1.
                  </Text>{" "}
                  Cancellation requests may be sent to us by the designated
                  feature on the Website, or via email at support@cutstruct.com
                  within 24 hours of placing an order with us. You shall receive
                  a full refund of payment made in the original form of payment
                  provided that the products have not been dispatched to you.
                  Where the products have been shipped, then the provisions of
                  the Return policy will apply.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.
                  </Text>{" "}
                  Where a cancellation request is received after 24 hours of
                  purchase, the cancellation may still be processed, but you
                  will be required to forfeit the delivery fee paid by you.
                </Text>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Flex
              onClick={isAtBottom ? scrollToTop : scrollToBottom}
              cursor={"pointer"}
              position={"absolute"}
              justifyContent="center"
              alignItems="center"
              bottom={5}
              right={5}
              bg={"#F5862E"}
              h={"40px"}
              w={"40px"}
              borderRadius={"50%"}
            >
              {isAtBottom ? (
                <BsArrowUp color={"white"} fontSize={"20px"} />
              ) : (
                <BsArrowDown color={"white"} fontSize={"20px"} />
              )}
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <span onClick={onOpen}>Return policy</span>
    </>
  );
}
