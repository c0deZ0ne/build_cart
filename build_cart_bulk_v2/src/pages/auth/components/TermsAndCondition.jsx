import React, { useRef, useState } from "react";
import {
  Box,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import "react-phone-input-2/lib/style.css";
import { BsArrowDown, BsArrowUp } from "react-icons/bs";
export default function TermsAndCondition() {
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
        size={"5xl"}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottom="1px solid #999999" color={"#211F5C"}>
            TERMS OF USE OF THE WEBSITE
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody onScroll={handleScroll}>
            <Stack id={"bottom-level"} ref={topRef}>
              <Text color={"#211F5C"} fontWeight={"bold"}>
                Introduction
              </Text>
              <Text>
                These Terms of Use constitute a legally binding and enforceable
                agreement between Cutstruct Technology Limited, a Nigerian
                limited liability company with its principal offices in Lagos,
                Nigeria (referenced as “we”, “our”, “us”, "Cutstruct" or
                “Company”), and you, (referenced as “you”, “your”) the buyer of
                products through our website: CutStruct.com (“Website”). <br />{" "}
                <br />
                These Terms shall apply to the Customer buying any product on
                our Website, and shall govern your use of the Website. By
                clicking the “I Agree” button, you unconditionally agree to
                abide by and be bound by these Terms. If you do not agree to be
                bound by and comply with all of these Terms or if you are not
                eligible or authorized to be bound by these Terms, please do not
                click on the “I agree” button. <br />
                <br />
                We may revise these Terms periodically. You will be deemed to
                have accepted these Terms if you continue to use the Website
                after any amendments are made.
                <br />
                <br />
              </Text>
              <Text color={"#211F5C"} fontWeight={"bold"}>
                1. Who We Are
              </Text>
              <Text ml={2}>
                Cutstruct is a business organization offering digitalized
                solutions in the construction and real estate industry through
                the Website.
              </Text>
              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                2. Intended Users
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.1
                  </Text>{" "}
                  The Website is available, but not limited, to all persons and
                  businesses who intend to purchase items from the Website.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.2
                  </Text>{" "}
                  When you access and use the Website, you:
                </Text>
                <Box ml={3}>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      2.2.1
                    </Text>{" "}
                    consent to the processing of your information in the manner
                    as provided in our Privacy Policy.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      2.2.2
                    </Text>{" "}
                    confirm that any and all registration information you submit
                    is truthful and accurate and you will maintain the accuracy
                    of such information.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      2.2.3
                    </Text>{" "}
                    confirm that your use of the Website will not violate any
                    applicable law, regulation, order or guideline.
                  </Text>
                </Box>
              </Box>
              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                3. Disclaimer
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.1
                  </Text>{" "}
                  Your use of the Website is at your sole discretion.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.2
                  </Text>{" "}
                  If you use and/or access the Website on or from an Android
                  device which you or someone else rooted or from an ios device
                  which you or someone else jail broke, Cutstruct shall not be
                  responsible for the security of your data, including your
                  personal information, and you shall bear all responsibility
                  for any breach, illegal access, loss and/or corruption of such
                  data.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.3
                  </Text>{" "}
                  Cutstruct makes no representations or warranties whatsoever in
                  respect of the information provided on the Website.
                  Information may be provided by third parties, including
                  vendors and other users of the Website. We cannot accept any
                  liability whatsoever in respect of any such content which is
                  provided by third parties and other users of the Website.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.4
                  </Text>{" "}
                  Any actions you take based on content, notifications and
                  otherwise provided on the Website are taken at your sole risk.
                  You should always check any information provided through the
                  Website to ensure its accuracy.
                </Text>
              </Box>
              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                4. Purchase of Products on the Website
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.1
                  </Text>{" "}
                  To purchase products on the Website, you will be required to
                  create a request for quotation (RFQ) in respect of the desired
                  products.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.2{" "}
                  </Text>
                  Upon creation, your RFQ is sent to all the vendors on the
                  Website, w ho have the desired products listed, and the
                  vendors will each tender a bid.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.3
                  </Text>{" "}
                  You will be entitled to consider each vendor's bid, and
                  ultimately decide who you desire to purchase the products
                  from.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.4
                  </Text>{" "}
                  Upon selection of your preferred vendor, you will be required
                  to agree to a Terms of Sale with the vendor, which will govern
                  your purchase of the products from the vendor.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.5
                  </Text>{" "}
                  You may return any goods purchased from the website, subject
                  to the provision of our Return, Refund, and Cancellation
                  Policy, and you now agree that the Return, Refund, and
                  Cancellation Policy is incorporated by reference into the
                  Terms of Sale.
                </Text>
              </Box>

              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                5. Customer Responsibility
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    5.1{" "}
                  </Text>
                  You shall procure all necessary permission to submit or
                  otherwise make available any information relating to any
                  business, feedback, idea, concept or invention before using
                  the Website. You further agree that:
                </Text>
                <Box ml={3}>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.1
                    </Text>{" "}
                    You will not use the Website in a way or take any action
                    that causes, or may cause damage to the Website or impair
                    the performance, availability , accessibility, integrity or
                    security of the Website.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.2
                    </Text>{" "}
                    You will not reproduce, duplicate, copy, sell, resell, or
                    exploit the Website, its content, its software or any
                    portion of any of the foregoing.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.3
                    </Text>{" "}
                    You will not use the Website for any purpose in violation of
                    local, state, national or international laws.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.4
                    </Text>{" "}
                    You will not solicit another user's password or personal
                    information under false pretenses.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.5
                    </Text>{" "}
                    You will not impersonate another person or entity or
                    otherwise misrepresent your affiliation with a person or
                    entity on the Website, and/or use or access another user's
                    account or password without permission.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.6
                    </Text>{" "}
                    You will not violate the legal rights of other users on the
                    Website, by defaming, abusing, stalking or threatening other
                    users.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.7
                    </Text>{" "}
                    You will not infringe on the intellectual property rights,
                    privacy rights, or moral rights of any third party on the
                    Website.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.8
                    </Text>{" "}
                    You will not post or transmit any content that is (or you
                    reasonably believe or should reasonably believe to be)
                    illegal, fraudulent, or unauthorized on the Website; or
                    further such activity that involves (or you reasonably
                    believe or should reasonably believe to involve) any stolen,
                    illegal, counterfeit, fraudulent, pirated, or unauthorized
                    material.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.9
                    </Text>{" "}
                    You will not publish falsehoods or misrepresentations on the
                    Website.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.10
                    </Text>{" "}
                    You will not post or transmit any content that is (or
                    reasonably should be understood to be) libelous, defamatory,
                    obscene, offensive (including material promoting or
                    glorifying hate, violence, or bigotry or otherwise
                    inappropriate to the community ethos of Cutstruct).
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.11
                    </Text>{" "}
                    You shall not collect or mine data relating to other users
                    of the Website.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.12
                    </Text>{" "}
                    You shall not interfere or attempt to interfere with the
                    proper working of the Website or otherwise disrupt the
                    operations or violate the security of the Website.
                    Violations of system or network operation or security may
                    result in civil or criminal liability. In this regard, we
                    will upon investigation of suspected violations of these
                    terms or illegal and inappropriate behavior relating to the
                    use of the Service, notify and fully cooperate with any law
                    enforcement agency or court order ordering us or directing
                    us to disclose the identity, behavior or activities of
                    anyone believed to have violated these terms or to have
                    engaged in illegal behavior.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      5.1.13
                    </Text>{" "}
                    You shall not solicit transactions with other users of the
                    platform outside the website, and in the event that you
                    solicit transactions with other users, Cutstruct will not be
                    liable to you or the said other user in any shape, way,
                    form, or manner whatsoever.
                  </Text>
                </Box>

                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    5.2
                  </Text>
                  You agree to comply with all user responsibilities and
                  obligations contained in these Terms. We will investigate
                  possible occurrences of any violations, and we may involve the
                  law enforcement authorities in prosecuting anyone involved
                  with such violations.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    5.3
                  </Text>{" "}
                  Non-enforcement of any of the above terms, or our failure to
                  act with respect to a breach by you does not constitute
                  consent or waiver, and we reserve the right to enforce such
                  default at our sole discretion. Specifically, no waiver of any
                  breach or default hereunder shall be deemed to be a waiver of
                  any preceding or subsequent breach or default. Nothing
                  contained in this Agreement shall be construed to limit the
                  actions or remedies available to us with respect to any
                  prohibited activity or conduct.
                </Text>
              </Box>

              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                6. License
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    6.1
                  </Text>{" "}
                  We hereby grant you a limited, non-exclusive, non-assignable,
                  non-sublicensable license to access and use the Website, and
                  any user guides or specifications, subject to the terms and
                  conditions of this Agreement.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    6.2
                  </Text>{" "}
                  Under this license, except as and only to the extent any of
                  the following restrictions are prohibited by applicable law or
                  any of the restricted activities are permitted by the
                  licensing terms of any open-sourced components incorporated
                  into the Website, you may not:
                </Text>
                <Box ml={3}>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      6.2.1
                    </Text>{" "}
                    Copy, decompile, reverse engineer, disassemble, derive the
                    source code of the Website, any updates relating to the
                    Website, or any part of the Website or updates, nor may you
                    attempt to do any of the foregoing.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      6.2.2
                    </Text>{" "}
                    Copy, modify, or create derivative works from the Website,
                    updates, or any part of the Website.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      6.2.3
                    </Text>{" "}
                    Remove or copy any copyright material or other proprietary
                    notices from the Website.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      6.2.4
                    </Text>{" "}
                    Transfer the content or materials from the Website to anyone
                    else or “mirror” the same on any server.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      6.2.5
                    </Text>{" "}
                    Circumvent, disable, or otherwise interfere with
                    security-related features of the Website.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      6.2.6
                    </Text>{" "}
                    Use any robot, spider, site search or retrieval service; or
                    any other manual or automatic device or process to retrieve,
                    index, data-mine, or in any way reproduce or circumvent the
                    navigational structure or presentation of the Website.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      6.2.7
                    </Text>{" "}
                    Harvest, collect or mine information about other users of
                    the Website.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      6.2.8
                    </Text>{" "}
                    Post or transmit any virus, worm, Trojan Horse, or other
                    harmful or disruptive element onto the Website.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      6.2.9
                    </Text>{" "}
                    Violate any applicable law, rule, or regulation in using the
                    Website.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      6.2.10
                    </Text>{" "}
                    Use any logo or other proprietary graphic or trademark of
                    Cutstruct without express written permission.
                  </Text>
                </Box>

                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    6.3
                  </Text>{" "}
                  In the event of a violation of any of these restrictions (as
                  determined by us), the license granted hereunder will be
                  automatically revoked, and you may be liable to prosecution by
                  the relevant law enforcement agencies and/or to compensate us
                  in damages.
                </Text>
              </Box>

              <br />
              <Text color={"#211F5C"} fontWeight={"bold"}>
                7. Third Party Sites &amp; Open-Source Software
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    7.1
                  </Text>{" "}
                  The Website may contain links to other independent third-party
                  websites (“Third Party Sites”). Third Party Sites are not
                  under our control, and we are not responsible for and do not
                  endorse their content.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    7.2
                  </Text>{" "}
                  You will need to make your own independent judgement regarding
                  your interaction with any Third Party Sites, including the
                  purchase and use of any products or services accessible
                  through them, or disclosure of personal information. To this
                  end, we encourage you to read the privacy policies of Third
                  Party Sites before using or accessing same.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    7.3
                  </Text>{" "}
                  If any open-source software is included in the Website, the
                  terms of an open-source license may override some of the terms
                  set out in this section
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                8. Requirements for the Provision of Services on the Website
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    8.1
                  </Text>{" "}
                  We can only provide you with services on the Website if you
                  provide us with the information we need in order to help you.
                  Accordingly, you must ensure that:
                </Text>
                <Box ml={3}>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      8.1.1
                    </Text>{" "}
                    Any information you give to us or enter into the Website is
                    accurate and in English.
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      8.1.2
                    </Text>{" "}
                    You promptly notify us if any information about you on our
                    database is or becomes inaccurate or incomplete
                  </Text>
                </Box>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                9. Technical Requirements for using the Website
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    9.1
                  </Text>{" "}
                  The Website includes software provided by people other than
                  the Company, and uses certain data that you provide to it in
                  order to work.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    9.2
                  </Text>{" "}
                  From time to time, updates to the Website may be made
                  available to you.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    9.3
                  </Text>{" "}
                  While we will take adequate measures to ensure the optimal
                  performance of the Website, we do not warrant or guarantee
                  that the Website will function with any particular device or
                  be compatible with the hardware or software on any particular
                  device.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    9.4
                  </Text>{" "}
                  Information on the Website will be transmitted over a medium
                  that is beyond our control; as such, multiple factors,
                  including network availability, may affect alert or
                  notification delivery or otherwise interfere with the
                  operation of the Website.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    9.5
                  </Text>{" "}
                  Without limiting the foregoing, we, and our licensors make no
                  representations or warranties about the availability,
                  accuracy, reliability, completeness, quality, performance,
                  suitability or timeliness of the Website, including software,
                  text, graphics, links, or communications provided on or
                  through the use of the Website.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    9.6
                  </Text>{" "}
                  Although we take reasonable measures to keep the Website free
                  of viruses, worms, Trojan Horses, or other code that contain
                  destructive properties, we do not warrant or guarantee that
                  materials available for downloading through the Website will
                  be free of such contaminations.
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                10. Accessing the Website
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    10.1
                  </Text>{" "}
                  The Website is accessible using the internet, data networks
                  and devices which can access the internet (“Infrastructure”).
                  We make the Website available for access using the
                  Infrastructure, but are not responsible for such
                  Infrastructure ourselves. If you wish to use the Services, you
                  should ensure you have an internet- enabled device and a
                  sufficient internet connection available.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    10.2
                  </Text>{" "}
                  When you use the Website or send e-mails to us, you are
                  communicating with us electronically. We will communicate with
                  you by posting notices, alerts, prompts, information fields or
                  other information through the Website as is necessary to serve
                  you.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    10.3
                  </Text>{" "}
                  We cannot guarantee that the Website will always be free from
                  virus, malware or other attacks. You should ensure that your
                  device used to access the Website is protected against viruses
                  and malicious software. You must not use or expose the Website
                  to virus or malicious software contamination.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    10.4
                  </Text>{" "}
                  You must not attempt to gain unauthorised access to the
                  Website.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    10.5
                  </Text>{" "}
                  The Website has not been developed to meet your individual
                  requirements. It is therefore your responsibility to ensure
                  that the facilities and functions of the Website meet your
                  requirements.
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                11. Your Personal Information
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    11.1
                  </Text>{" "}
                  We record your use of the Website. Details of how we protect
                  and use such recordings are set out in our Privacy Policy.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    11.2
                  </Text>{" "}
                  We use your personal information in accordance with our
                  Privacy Policy and data protection laws of Nigeria. Please
                  take the time to read it as it includes important details
                  about how we secure and process your data.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    11.3
                  </Text>{" "}
                  Like many other websites, we use cookies to identify you as a
                  user and to customize and improve the Website. A cookie is a
                  small data file that is transferred to your computer or mobile
                  device. It enables us to remember your account log-in
                  information, IP addresses, web traffic, number of times you
                  visit, date and time of visits.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    11.4
                  </Text>{" "}
                  Some browsers may automatically accept cookies while some can
                  be modified to decline cookies or alert you when a website
                  wants to place a cookie on your computer. If you choose to
                  disable cookies, it may limit your ability to use the Website.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    11.5
                  </Text>{" "}
                  Vendors shall be directly responsible to you for any misuse of
                  your personal data and Cutstruct shall bear no liability to
                  buyers in respect of any misuse by vendors of your personal
                  data.
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                12. Liability
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    12.1
                  </Text>{" "}
                  Our aggregate liability to you in respect of any items
                  purchased on the Website shall not exceed the total amount
                  paid by you for the said item. Each separate transaction on
                  the Website shall constitute a separate contract for the
                  purpose of this section.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    12.2
                  </Text>{" "}
                  We are not obligated to compensate you for any loss or damage
                  that arises indirectly, incidentally or consequentially from
                  your use of the Website. We will also not be liable for a loss
                  or damage not being a foreseeable result of a breach of these
                  Terms.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    12.3
                  </Text>{" "}
                  Our services on the Website are provided on an `as is` basis
                  without a warranty of any kind being provided by us.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    12.4
                  </Text>{" "}
                  If we provide digital content that is defective and the same
                  damages a device or other digital content belonging to you,
                  and we have not employed reasonable skill and care, we will
                  compensate you or repair the device or content (at our
                  election).
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    12.5
                  </Text>{" "}
                  We will not be liable for any loss or damage resulting from
                  defective digital content where you have failed to follow our
                  usage instructions or advice in these Terms.
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                13. Intellectual Property
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    13.1
                  </Text>{" "}
                  We own the copyright and other intellectual property rights in
                  the Website and the Cutstruct mark, logo, combined mark and
                  logo and other marks indicated on the Website (“the Cutstruct
                  IPR”).
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    13.2
                  </Text>{" "}
                  You are not permitted to copy, distribute, further develop,
                  reproduce, re-publish, modify, alter, download, post,
                  broadcast, transmit or make any business use of the Cutstruct
                  IPR. You must not remove, alter or conceal or obscure any
                  copyright, trademark, service mark or other proprietary
                  notices regarding the Cutstruct IPR.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    13.3
                  </Text>{" "}
                  Our services on the Website are provided on an `as is` basis
                  without a warranty of any kind being provided by us.
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                14. Customer Support
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    14.1
                  </Text>{" "}
                  All complaints, inquiries and requests with respect to the use
                  of the Website may be communicated to us via the following
                  channels:
                </Text>
                <Box ml={3}>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      14.1.1
                    </Text>{" "}
                    Email: support@cutstruct.com
                  </Text>
                </Box>

                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    14.2
                  </Text>{" "}
                  We shall use our best efforts to promptly respond to and/or
                  address any complaints, inquiries and requests.
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                15. Customer Support
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  You hereby agree to indemnify and undertake to keep Cutstruct,
                  its staff and affiliates indemnified against any losses,
                  damages, costs, liabilities and expenses (including without
                  limitation reasonable legal fees and expenses) arising out of
                  any breach by you of any provision of these Terms, or arising
                  out of any claim that you have breached. You will indemnify
                  and hold Cutstruct harmless from and against any claim, suit
                  or proceedings brought against Cutstruct arising from or in
                  connection with your violation of the Intellectual Property or
                  other rights of third parties in relation to your use of the
                  Website.
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                16. Complaints and Disputes
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    16.1
                  </Text>{" "}
                  If you have any formal complaint about the Website, we would
                  like to resolve it as soon as possible. Please tell us about
                  your complaint through the channels provided herein as soon as
                  you can so that we can attend to them. We may ask you for
                  certain details about you and your complaint in order to
                  address it, and your response time will impact on how quickly
                  we may be able to resolve your complaint.
                </Text>

                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    16.2
                  </Text>{" "}
                  If we are unable to resolve a disagreement amicably, either of
                  us can refer the dispute to the Lagos Multi-Door Courthouse
                  (LMDC) for mediation, which shall be conducted in accordance
                  with the LMDC Mediation Procedure Rules or such other mutually
                  agreed rules).
                </Text>

                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    16.3
                  </Text>{" "}
                  Neither party shall be precluded from seeking any injunctive
                  reliefs in the courts of law.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    16.4
                  </Text>{" "}
                  These Terms are governed by Nigerian law and the Nigerian
                  courts shall have exclusive jurisdiction to hear any claim
                  arising out of or in connection with these Terms or the use of
                  the Website.
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                17. Termination
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    17.1
                  </Text>{" "}
                  These Terms are effective until terminated by either you or
                  us.
                </Text>

                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    17.2
                  </Text>{" "}
                  If you violate these Terms, any permission and/or license(s)
                  granted hereunder for the use of the Website, shall be
                  automatically terminated.
                </Text>

                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    17.3
                  </Text>{" "}
                  We may, in our sole discretion, terminate these Terms and your
                  access to any or all of the Provided, at any time and for any
                  reason.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    17.4
                  </Text>{" "}
                  Termination of these Terms shall be subject to any portions
                  hereof that impliedly survive expiration or termination.
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} ref={bottomRef} fontWeight={"bold"}>
                18. Entire Agreement
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  These Terms constitute the entire agreement between you and us
                  pertaining to the use of the Website. Anything contained in or
                  delivered through the Website that is inconsistent with or
                  conflicts with the these Terms is superseded by these Terms.
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"} id={"bottom"}>
                19. Severability
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  If any of the provisions of these Terms are held to be not
                  enforceable by a court or other tribunal of competent
                  jurisdiction, then such provisions shall be amended, limited
                  or eliminated to the minimum extent necessary so that these
                  Terms shall otherwise remain in full force and effect.
                </Text>
              </Box>
              <br />

              <Text color={"#211F5C"} fontWeight={"bold"}>
                20. Assignment
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  You agree that these Terms and all incorporated agreements
                  between you and us may be assigned by us, in our sole
                  discretion to any third party
                </Text>
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

      <span onClick={onOpen}>Our terms</span>
    </>
  );
}
