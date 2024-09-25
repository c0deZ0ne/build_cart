import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";

export default function PrivacyPolicy() {
  const topRef = useRef();
  const bottomRef = useRef();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setIsAtBottom(false);
  }, [isOpen]);

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
    console.log(bottomPosition, window.innerHeight);
    setIsAtBottom(isBottom);
  };

  window.addEventListener("scroll", handleScroll);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"5xl"}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottom="1px solid #999999" color={"#211F5C"}>
            PRIVACY POLICY
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody onScroll={handleScroll}>
            <Stack id={"bottom-level"} ref={topRef}>
              <Text color={"#211F5C"} fontWeight={"bold"}>
                Introduction
              </Text>
              <Text>
                Cutstruct Technology Limited (hereinafter referenced as “we”,
                “our”, “us” and “the Company”) is committed to safeguarding your
                privacy by protecting your personal data in accordance with
                applicable laws. This Privacy Policy outlines how and why we
                collect, use, share and protect your personal data. About our
                Services We are a business organization offering digitalized
                services and solutions in the construction and real estate
                industry across Africa through the Website. Through our website,
                we provide a platform where buyers(builders) can meet vendors
                within the construction industry (“the Services”). By accessing
                and using our website, you agree that your personal data will be
                handled in the manner as described in this Policy. Kindly read
                and understand the terms of this Policy carefully before using
                any of the Services. In the event that you disagree in any way
                with the terms stated herein, you should not use or access the
                Services. We shall take your continued use of the Services as
                your consent to this Policy and the use and sharing of your
                information as provided herein
                <br />
                <br />
              </Text>
              <Text color={"#211F5C"} fontWeight={"bold"}>
                1. What Information We Use and How We Collect Same
              </Text>
              <Text ml={2}>
                To satisfactorily provide the Services to you, we receive and
                store the information you provide to us including your identity
                data, contact data, delivery address and financial data when you
                interact with us on our website and/or access our Services. Such
                information is categorized as follows:
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    1.1 Personal Data
                  </Text>{" "}
                  <br /> When you access our Services, you complete forms and
                  provide us with basic information about yourself, such as your
                  name, date of birth, phone number, physical address and email
                  address. We collect such personal data in order to provide and
                  continually improve our Services. We may also collect, use,
                  store and transfer your personal data for marketing and
                  personal data optimization purposes
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    1.2 Business Data
                  </Text>{" "}
                  <br /> Where applicable, we also collect your company
                  information such as your company registration number, TIN, and
                  office address.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    1.3 Technical Information and Analytics
                  </Text>{" "}
                  <br />
                  When you use our website, we may automatically collect the
                  following information where this is permitted by your device
                  settings:
                </Text>
                <Box ml={3}>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      1.3.1
                    </Text>{" "}
                    Technical information, including your IP address, your login
                    information, laptop and operating system type and version,
                    browser or Website version, your time zone setting, and your
                    location (based on IP address).
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      1.3.2
                    </Text>{" "}
                    Information about your site visit, including products and
                    services you viewed or ordered on our website, our website
                    response times, interaction information (such as button
                    presses) and any phone number used to call our customer
                    service number. Cookies and similar technologies may be used
                    to collect this information, such as your interactions with
                    our Services..
                  </Text>
                </Box>
              </Box>
              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                2. Use of Personal Data
              </Text>
              <Box ml={3}>
                <Text>
                  The purposes for which we use your personal data are detailed
                  below.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.1
                  </Text>{" "}
                  To offer and provide you with our Services and to support our
                  business functions.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.2
                  </Text>{" "}
                  To register your account, fulfill your requests for Services
                  and communicate with you about such requests.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.3
                  </Text>{" "}
                  To respond to reviews, comments, or other feedback you provide
                  us.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.4
                  </Text>{" "}
                  As may be necessary to establish, exercise, and defend legal
                  rights..
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.5
                  </Text>{" "}
                  To evaluate and improve our business, including developing new
                  products and services.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.6
                  </Text>{" "}
                  To provide, administer, and communicate with you about
                  products, services, offers, programmes, and promotions of our
                  Services.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.7
                  </Text>{" "}
                  To enforce our Terms of Use and Conditions, and to prevent and
                  combat fraud.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.8
                  </Text>{" "}
                  To contact you or send you marketing content and communication
                  about our products, services, or surveys. You may exercise
                  your right to object to such contact from us or opt out from
                  the marketing content. Please note however that if you opt out
                  of marketing content, we may still send you messages relating
                  to transactions and our services related to our ongoing
                  business relationship.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.9
                  </Text>{" "}
                  To help us personalize our Service offerings in order to
                  improve your experience on the Website, and to protect the
                  security and integrity of our Services.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.10
                  </Text>{" "}
                  Third party processing.
                </Text>
              </Box>
              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                3. Data Protection Principles
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.1
                  </Text>{" "}
                  We shall ensure that your data is:
                </Text>
                <Box ml={3}>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      3.1.1
                    </Text>{" "}
                    processed in accordance with specific, legitimate and lawful
                    purposes.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      3.1.2
                    </Text>{" "}
                    stored only for the period within which it is reasonably
                    needed.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      3.1.3
                    </Text>{" "}
                    reasonably secured against foreseeable hazards and breaches
                    such as theft, cyberattacks, unauthorized dissemination,
                    disruptions, damages and/or manipulations of any kind.
                  </Text>
                </Box>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.2
                  </Text>{" "}
                  We shall not be liable for any breach which occurs due to no
                  fault of ours.
                </Text>
              </Box>
              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                4. Your Rights Regarding the Use Of Your Personal Data
              </Text>
              <Box ml={3}>
                <Text>
                  You have rights under applicable data protection laws in
                  relation to your personal data, including the right:
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.1
                  </Text>{" "}
                  To withdraw consent to the processing of your data at any
                  time, without affecting the lawfulness of processing of your
                  information which you previously consented to. Note that if
                  you revoke your consent to such processing, we will be unable
                  to provide you with the Service(s) for which such consent is
                  required.
                </Text>
                <Text ml={5}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.2
                  </Text>{" "}
                  To restrict the use of your personal data pending a
                  determination as to the overriding nature of the legitimate
                  grounds in 4.1 above.
                </Text>
                <Text ml={5}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.3
                  </Text>{" "}
                  To request for the deletion of your personal data, subject to
                  any overriding legitimate grounds for the use of same, such as
                  our obligation to store your personal information and company
                  details for prescribed periods of time.
                </Text>
                <Text ml={5}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.4
                  </Text>{" "}
                  To request for, and receive free of charge, any information
                  regarding you which has been collected on the website, in
                  concise & intelligible written form; provided that where such
                  request is determined by us to be manifestly unfounded or
                  excessive, we shall be entitled to charge a reasonable fee for
                  same, taking into consideration, inter alia the administrative
                  costs of providing such information.
                </Text>
                <Text ml={5}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.5
                  </Text>{" "}
                  To contest the accuracy of your personal information, and to
                  procure the rectification of any inaccurate information.
                </Text>
              </Box>

              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                5. Sharing Your Personal Data{" "}
              </Text>
              <Box ml={3}>
                <Text>We may share your personal data as follows</Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    5.1
                  </Text>{" "}
                  We may share your personal data with members of our corporate
                  group and our partners to aid the optimal delivery of our
                  Services to you.
                </Text>

                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    5.2
                  </Text>
                  We may share your personal data with companies we have hired
                  to provide services on our behalf, including those who act as
                  data processors on our behalf, acting strictly under contract
                  in accordance with applicable data protection laws. Those data
                  processors are bound by strict confidentiality and data
                  security provisions, and they can only use your data in the
                  ways specified by us.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    5.3
                  </Text>{" "}
                  We may share with our commercial partners aggregated data that
                  does not personally identify you, but which shows general
                  trends, for example, the number of users of our Services.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    5.4
                  </Text>{" "}
                  We may preserve or disclose information about you to comply
                  with a law, regulation, legal process, or governmental
                  request; to assert legal rights or defend against legal
                  claims; or to prevent, detect, or investigate illegal
                  activity, fraud, abuse, violations of our terms, or threats to
                  the security of our Services or the physical safety of any
                  person.
                </Text>
              </Box>

              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                6. Retention Periods
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  We reserve the right to retain your personal data in
                  accordance with national and international best practice.
                  However, we may retain records for a longer period as required
                  by law or regulation.
                </Text>
              </Box>

              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                7. Data Security
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  We will take all steps reasonably necessary to ensure that
                  your data is treated securely and in accordance with this
                  privacy policy. Your data may be processed or stored via
                  destinations outside of Nigeria (e.g. where we work with third
                  parties who help deliver our Services to you, whose servers
                  may be located outside of Nigeria), but always in accordance
                  with applicable data protection laws, including mechanisms to
                  lawfully transfer data across borders, and subject to strict
                  safeguards.
                </Text>
              </Box>

              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                8. Security Of Personal Data
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  Where you have chosen a password that enables you to access
                  our website, you are responsible for keeping this password
                  confidential. We ask you not to share the password with
                  anyone. <br />
                  Despite our very judicious efforts, you understand and accept
                  that there is still a risk to your personal data being gained
                  access to without authorisation due to the fact that there is
                  no full guarantee of fidelity as per information transmitted
                  across the internet. You are however advised to adhere to our
                  security protocols at all times. We will not be liable for any
                  unauthorized access to your personal information, save to the
                  extent that such access is as a result of the willful
                  negligence of the Company.
                </Text>
              </Box>

              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                9. Changes to this Privacy Policy
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  We may modify this Policy from time to time without notice to
                  you. To make sure you are aware of any changes, please review
                  this policy periodically. You agree to be bound by the changes
                  where you continue to use our Services after the changes have
                  been made and we have duly notified you of them
                </Text>
              </Box>

              <br />
              <Text color={"#211F5C"} ref={bottomRef} fontWeight={"bold"}>
                7. Inquiries
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  If you have any further questions about how we process your
                  information, or if you would like to exercise any of your
                  rights regarding your personal information as set out above,
                  please contact us through our Data Protection Officer, using
                  the details below:
                </Text>
                <Box w={"400px"}>
                  <Flex>
                    <Text>Email address:</Text>
                    <Spacer />
                    <Text color={"#F5862E"}>legal@cutstruct.com</Text>
                  </Flex>
                  <Flex>
                    <Text>Phone Number: </Text>
                    <Spacer />
                    <Text>+234 7033 252 662</Text>
                  </Flex>
                </Box>
              </Box>
              <br />
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

      <span onClick={onOpen}>Privacy policy</span>
    </>
  );
}
