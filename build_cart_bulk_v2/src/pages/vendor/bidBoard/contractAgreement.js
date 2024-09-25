import React, { useState } from "react";
import { Box, Text, Flex, Stack, Checkbox } from "@chakra-ui/react";
import Button from "../../../components/Button";
import BaseTable from "../../../components/Table";
import { capitalize } from "lodash";
import moment from "moment";
import TruncateText from "../../../components/Truncate";

export default function ContractAgreement({ handleClick, isLoading, details }) {
  const ref = React.createRef();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [isChecked, setChecked] = useState(false);

  const amount = details?.RfqQuote?.RfqQuoteBargain[0]?.price;
  const tableBody = [
    {
      "S/N": 1,
      itemname: capitalize(details?.RfqQuote?.RfqRequestMaterial?.name) ?? "-",
      description: (
        <TruncateText
          popover={details?.RfqQuote?.RfqRequestMaterial?.description}
          width="100%"
        >
          {details?.RfqQuote?.RfqRequestMaterial?.description}
        </TruncateText>
      ),
      additionalNote: details?.RfqQuote?.additionalNote,
      quantity: details?.RfqQuote?.RfqRequestMaterial?.quantity ?? 0,
      budget: new Intl.NumberFormat().format(
        details?.RfqQuote?.RfqRequestMaterial?.budget ?? 0
      ),
      amount: new Intl.NumberFormat().format(amount ?? 0),
      totalCost: new Intl.NumberFormat().format(
        amount * details?.RfqQuote?.RfqRequestMaterial?.quantity ?? 0
      ),
      expectedDelivery: moment(details?.RfqRequest?.deliveryDate).format(
        "DD-MM-YYYY"
      ),
      paymentType: capitalize(
        details?.RfqRequest?.paymentTerm?.replaceAll("_", " ")
      ),
    },
  ];

  return (
    <>
      <div id="contract-term" ref={ref}>
        <Box
          width="100%"
          height="400px"
          boxShadow="lg"
          p="20px"
          overflow="auto"
        >
          <Flex
            gap={3}
            fontWeight="600"
            textTransform="capitalize"
            fontSize="20px"
          >
            <Text color="secondary">Sales Agreement:</Text>
            <Text color="info">
              {user?.userName} & {details?.RfqRequest?.CreatedBy?.name}
            </Text>
          </Flex>
          <Box my={5}>
            <Stack id={"bottom-level"}>
              <Text color={"#211F5C"} fontWeight={"bold"}>
                INTRODUCTION
              </Text>
              <Text ml={2}>
                These Terms of Sale (“Terms”) constitute a legally binding and
                enforceable agreement between the Vendor and the Purchaser,
                jointly called, “Parties” and relates to the Purchaser’s
                purchase of the Products (subsequently defined) from the Vendor
                on this website. To proceed, both Parties will be required to
                click on “I Agree” from their respective account pages on this
                website. <br /> <br /> Where either Party does not agree to be
                bound by and comply with the Terms, then the sale/purchase
                (“Transaction”) cannot be completed. The Purchaser has issued a
                request for quotation for the sale of the Products (subsequently
                defined) following which the Vendor, among others, tendered a
                bid. Upon careful scrutiny of all the bids received, the
                Purchaser has decided to purchase the Products from the Vendor
                on the conditions contained in these Terms.
              </Text>
              <Text color={"#211F5C"} fontWeight={"bold"}>
                1. AGREEMENT OF SALE
              </Text>
              <Text ml={2}>
                The Vendor sells and the Purchaser purchases the products and/or
                services set out below (Products):
              </Text>
              <Box overflow={"auto"}>
                <BaseTable
                  tableColumn={[
                    "S/N",
                    "ITEM NAME",
                    "DESCRIPTION / BRAND",
                    "additional Note",
                    "QUANTITY",
                    "BUDGET (₦)",
                    "AMOUNT (₦)",
                    "TOTAL PRICE (₦)",
                    "PAYMENT TYPE",
                    "EXPECTED DELIVERY DATE",
                  ]}
                  tableBody={tableBody}
                />
              </Box>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Flex
                  borderRadius={"8px"}
                  justify={"flex-end"}
                  direction="column"
                  align="center"
                  bg="#13355a"
                  padding={"20px 50px"}
                  my="10px"
                  color="#fff"
                >
                  <Text fontSize="20px">Total Cost</Text>
                  <Text fontWeight={"bold"} fontSize="25px">
                    &#8358;{" "}
                    {new Intl.NumberFormat().format(
                      Number(
                        amount *
                          details?.RfqQuote?.RfqRequestMaterial?.quantity ?? 0
                      )
                    )}
                  </Text>
                </Flex>
              </div>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                2. PROOF OF ORDER AND ORDER TRACKING
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.1
                  </Text>{" "}
                  The computerized records stored via this website, and
                  displayed respectively on the account page of the Parties will
                  be sufficient proof of communications and orders.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.2
                  </Text>{" "}
                  An email may also be automatically generated and sent to the
                  Parties, upon the confirmation of an order.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    2.3
                  </Text>{" "}
                  Purchaser can track their order via the “Track Order” option,
                  after signing into their account.
                </Text>
              </Box>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                3. .PRICES, PAYMENT, AND ESCROW
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.1
                  </Text>{" "}
                  In consideration for the Products, the Purchaser will pay a
                  sum of [Insert Purchase Price for the Products].
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.2
                  </Text>{" "}
                  All prices are expressed in the Nigerian Naira and the final
                  invoice is inclusive of taxes.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.3
                  </Text>{" "}
                  Payment is made according to the conditions as stipulated when
                  order is placed. Payments are required to be in full for the
                  order to be processed.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.4
                  </Text>{" "}
                  All payments are received by the escrow partners to Cutstruct
                  Technology Limited (the owners and operators of this website)
                  (“Cutstruct”), and are only disbursed to the Vendor 2 (two)
                  business days after:
                </Text>
                <Box ml={3}>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      3.4.1
                    </Text>{" "}
                    The delivery to the Products to the Purchaser, where the
                    purchaser does not initiate a dispute in line with the
                    Return, Refund & Cancellation
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      3.4.2
                    </Text>{" "}
                    The resolution of any dispute which may be initiated by the
                    Purchaser.
                  </Text>
                </Box>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.5
                  </Text>{" "}
                  Where Cutstruct is unable to confirm the Purchaser’s order,
                  then the order will not be processed, and the obligations to
                  deliver the Products will not arise.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    3.6
                  </Text>{" "}
                  Upon confirmation of payment, a payment receipt will be issued
                  to the Purchaser.
                </Text>
              </Box>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                4. OBLIGATIONS OF THE VENDOR
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.1
                  </Text>{" "}
                  Upon confirmation of the Purchaser’s payment by Cutstruct, the
                  Vendor will make the Products available for supply to the
                  Purchaser, in such quantity, quality, and within timeframe
                  agreed by the Parties.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.2
                  </Text>
                  For the avoidance of doubt, the obligation to deliver the
                  Products will not arise until:
                </Text>
                <Text ml={3}>
                  <Text as={"span"} color={"#F5862E"}>
                    a.{" "}
                  </Text>
                  the execution of these Terms, and
                  <Text as={"span"} color={"#F5862E"}>
                    b.{" "}
                  </Text>
                  confirmation of payment by Cutstruct.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.3
                  </Text>{" "}
                  To request for the deletion of your personal data, subject to
                  any overriding legitimate grounds for the use of same, such as
                  our obligation to store your personal information and company
                  details for prescribed periods of time.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.4
                  </Text>{" "}
                  To request for, and receive free of charge, any information
                  regarding you which has been collected on the website, in
                  concise & intelligible written form; provided that where such
                  request is determined by us to be manifestly unfounded or
                  excessive, we shall be entitled to charge a reasonable fee for
                  same, taking into consideration, inter alias the
                  administrative costs of providing such information.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    4.5
                  </Text>{" "}
                  To contest the accuracy of your personal information, and to
                  procure the rectification of any inaccurate information.
                </Text>
              </Box>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                5. OBLIGATIONS OF THE PURCHASER
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text>
                    {" "}
                    The Purchaser will pay the Purchase Price as agreed.{" "}
                  </Text>
                </Text>
              </Box>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                6. DELIVERY
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text>
                    {" "}
                    Subject to the provisions of Paragraph 4.2, the vendor will
                    make the Products available for timely delivery to the
                    destination agreed with the Purchaser within the timeframe
                    agreed by the Parties.{" "}
                  </Text>
                </Text>
              </Box>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                7. INSPECTION AND RETURNS
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text>
                    {" "}
                    Purchaser shall be entitled to examine the Products for
                    defects upon delivery, and may subject to the Refund,
                    Return, and Cancellation Policy of this Website, be entitled
                    to return the Products or cancel the Transaction.
                  </Text>
                </Text>
              </Box>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                8. DATA PROTECTION
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text>
                    {" "}
                    The Parties understand and agree that in furtherance of the
                    Transaction, they may disclose personal data to each other.
                    Each Party hereby undertakes to process the personal data
                    disclosed by the other Party strictly in compliance with all
                    applicable data protection laws and regulations, and shall
                    ensure that such personal data are not used for any unlawful
                    purposes.
                  </Text>
                </Text>
              </Box>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                9. PURCHASER’S REPRESENTATION
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text>
                    {" "}
                    The Purchase Price has not been derived from illegal sources
                    or in a manner in contravention of any Anti- Money
                    Laundering Laws relevant to the Transaction.{" "}
                  </Text>
                </Text>
              </Box>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                10. VENDOR’S REPRESENTATION
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text> The Products will be of merchantable quality.</Text>
                </Text>
              </Box>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                11. OBLIGATIONS OF THE VENDOR
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    11.1
                  </Text>
                  The Vendor will not be considered in breach of her/his/its
                  obligations under these Terms or be responsible for any delay
                  in carrying out her/ his/its obligations, if performance is
                  prevented or delayed wholly or in part as a consequence of war
                  (whether war declared or not), emergency, strike, industrial
                  dispute, accident, fire, earthquake, flood, storm, pandemic,
                  epidemic, tempest, any act of God or, governmental acts, or
                  any other cause beyond the reasonable control of the Party
                  affected.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    11.2
                  </Text>
                  Upon the occurrence of an event of Force Majeure, notice shall
                  be given to the Purchaser via their account page or by email.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    11.3
                  </Text>
                  Where the event of Force Majeure extends un-remedied for up
                  till [Insert Timeframe] weeks/months then the Parties may
                  agree to terminate these Terms.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    11.4
                  </Text>
                  In the event that these Terms are terminated by the Parties as
                  a result of the subsistence of an event of Force Majeure:
                </Text>
                <Box ml={3}>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      a
                    </Text>{" "}
                    neither Party will have the right to claim for damages or
                    compensation from the other Party; and
                  </Text>
                  <Text ml={2}>
                    <Text as={"span"} color={"#F5862E"}>
                      b
                    </Text>{" "}
                    Cutstruct shall not be liable to the Parties in any way,
                    form, manner, or for any purpose whatsoever.
                  </Text>
                </Box>
              </Box>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                12. DISPUTE RESOLUTION
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    12.1
                  </Text>{" "}
                  The Parties will act with each other in good faith, and will
                  endeavour to settle any dispute, difference or claim arising
                  from these Terms in an amicable manner.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    12.2
                  </Text>{" "}
                  If the dispute, difference or claim is not settled amicably
                  within 7 (Seven) business days, either of the Parties may
                  refer the dispute, difference or claim to mediation of one
                  mediator, which shall be conducted in accordance with the LMDC
                  Mediation Procedure Rules, or such other Rules mutually agreed
                  by the Parties. The mediator shall be appointed by the
                  President of the Institute of Chartered Mediator and
                  Conciliators, and the mediation proceedings may be held
                  virtually.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    12.3
                  </Text>{" "}
                  If for any reason, the dispute is not resolved by mediation,
                  either of the Parties may refer the dispute to arbitration by
                  one arbitrator, in accordance with the provisions of the
                  Arbitration and Conciliation Act Cap A18, Laws of the
                  Federation of Nigeria 2004. The Arbitrator shall be appointed
                  by the President of the Chartered Institute of Arbitrators, UK
                  (Nigerian Branch). The venue of the arbitration shall, except
                  otherwise agreed by the Parties, be in Nigeria. Where the
                  Parties are resident in different states in Nigeria, then the
                  venue will be determined by the Arbitrator, having due regard
                  to the location of the Parties, and except otherwise agreed by
                  the Parties, the arbitration shall be held at a neutral venue.
                </Text>
                <Text ml={2}>
                  <Text as={"span"} color={"#F5862E"}>
                    12.4
                  </Text>{" "}
                  The provisions of this clause shall not preclude the Parties
                  from seeking any injunctive relief in the courts of law.
                </Text>
              </Box>

              <Text color={"#211F5C"} fontWeight={"bold"}>
                13. GOVERNING LAW
              </Text>
              <Box ml={3}>
                <Text ml={2}>
                  These Terms shall be governed by and construed under the laws
                  of the Federal Republic of Nigeria.
                </Text>
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box my="20px">
          <Checkbox
            onChange={(e) => setChecked(e.target.checked)}
            colorScheme="orange"
          >
            <span style={{ fontSize: "14px" }}>
              I agree to the term of service
            </span>
          </Checkbox>
        </Box>

        <Box width="70%" margin="auto">
          <Button
            full
            disabled={!isChecked}
            isLoading={isLoading}
            onClick={handleClick}
          >
            Save
          </Button>
        </Box>
      </div>
    </>
  );
}
