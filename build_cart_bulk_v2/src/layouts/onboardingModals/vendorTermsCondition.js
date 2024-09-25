import {
  Box,
  Text,
  Heading,
  Stack,
  Table,
  Thead,
  Tr,
  Tbody,
  Td,
  Checkbox,
} from "@chakra-ui/react";
import React from "react";

const VendorTermsConditions = ({ setCheckedItems }) => {
  return (
    <div>
      <Box textAlign="center">
        <Heading color="#F5862E" m="20px 0 10px" fontSize={"24px"}>
          Terms and Conditions
        </Heading>
      </Box>
      <Box width="100%" height="350px" boxShadow="lg" px="2" overflow="auto">
        <Heading color="primary" m="20px 0 10px" fontSize="18px">
          TERMS OF USE OF THE WEBSITE
        </Heading>

        <Stack id={"bottom-level"} fontSize="14px">
          <Text color={"#211F5C"} fontSize="16px" fontWeight={"bold"}>
            Introduction
          </Text>
          <Box>
            These Terms of Use constitute a legally binding and enforceable
            agreement between Cutstruct Technology Limited, a Nigerian limited
            liability company with its principal offices in Lagos, Nigeria
            (referenced as “we”, “our”, “us”, "Cutstruct" or “Company”), and
            you, (referenced as “you”, “your”) the buyer of products through our
            website: CutStruct.com (“Website”).
            <Text my="4">
              These Terms shall apply to the Customer buying any product on our
              Website, and shall govern your use of the Website. By clicking the
              “I Agree” button, you unconditionally agree to abide by and be
              bound by these Terms. If you do not agree to be bound by and
              comply with all of these Terms or if you are not eligible or
              authorized to be bound by these Terms, please do not click on the
              “I agree” button.
            </Text>
            <Text my="4">
              We may revise these Terms periodically. You will be deemed to have
              accepted these Terms if you continue to use the Website after any
              amendments are made.
            </Text>
          </Box>
          <Text color={"#211F5C"} fontWeight={"bold"}>
            1. Who We Are
          </Text>
          <Text ml={2}>
            Cutstruct is a business organization offering digitalized solutions
            in the construction and real estate industry through the Website.
          </Text>

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
                consent to the processing of your information in the manner as
                provided in our Privacy Policy.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  2.2.2
                </Text>{" "}
                confirm that any and all registration information you submit is
                truthful and accurate and you will maintain the accuracy of such
                information.
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
              If you use and/or access the Website on or from an Android device
              which you or someone else rooted or from an ios device which you
              or someone else jail broke, Cutstruct shall not be responsible for
              the security of your data, including your personal information,
              and you shall bear all responsibility for any breach, illegal
              access, loss and/or corruption of such data.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                3.3
              </Text>{" "}
              Cutstruct makes no representations or warranties whatsoever in
              respect of the information provided on the Website. Information
              may be provided by third parties, including Suppliers and other
              users of the Website. We cannot accept any liability whatsoever in
              respect of any such content which is provided by third parties and
              other users of the Website.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                3.4
              </Text>{" "}
              Any actions you take based on content, notifications and otherwise
              provided on the Website are taken at your sole risk. You should
              always check any information provided through the Website to
              ensure its accuracy.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            4. Registration of Account
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                4.1
              </Text>{" "}
              You are required to register an account with us and provide the
              following in furtherance of your registration:.
            </Text>
            <Text ml={5}>
              <Text as={"span"} color={"#F5862E"}>
                4.1.1
              </Text>
              Full Name
            </Text>
            <Text ml={5}>
              <Text as={"span"} color={"#F5862E"}>
                4.1.2
              </Text>{" "}
              Email Address
            </Text>
            <Text ml={5}>
              <Text as={"span"} color={"#F5862E"}>
                4.1.3
              </Text>{" "}
              Phone Number
            </Text>
            <Text ml={5}>
              <Text as={"span"} color={"#F5862E"}>
                4.1.4
              </Text>{" "}
              Password
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            5. Supplier's Responsibility
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                5.1
              </Text>
              You agree that:
            </Text>
            <Box ml={3}>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.1
                </Text>{" "}
                you will keep your account details confidential.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.2
                </Text>{" "}
                you will immediately notify us in writing if you become aware of
                any disclosure of your account details.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.3
                </Text>{" "}
                you will be fully responsible for any activity conducted on the
                Website as a result of a disclosure of your account details.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.4
                </Text>{" "}
                your account shall be managed solely by you and will not be
                assigned to a third party. You will be responsible for any
                liability arising from the assignment of your account to a third
                party.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.5
                </Text>{" "}
                you will not impersonate another person or entity or otherwise
                misrepresent your affiliation with a person or entity, and/or
                use or access another supplier’s account.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.6
                </Text>{" "}
                you will not violate the legal rights of other users of the
                Website, by defaming, abusing, stalking or threatening other
                supplier on and users of the Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.7
                </Text>{" "}
                you will not infringe on the intellectual property rights,
                privacy rights, or moral rights of any third party.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.8
                </Text>{" "}
                you will not post or transmit any content that is (or you
                reasonably believe or should reasonably believe to be) illegal,
                fraudulent, or unauthorized; or further such activity, or that
                involves (or you reasonably believe or should reasonably believe
                to involve) any stolen, illegal, counterfeit, fraudulent,
                pirated, or unauthorized material.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.9
                </Text>{" "}
                You will not publish falsehoods or misrepresentations on and in
                respect of the Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.10
                </Text>{" "}
                you will not conduct yourself in a manner that will cause you to
                receive negative ratings and reviews on the Website. (including
                material promoting or glorifying hate, violence, or bigotry or
                otherwise inappropriate to the community ethos of Cutstruct).
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.11
                </Text>{" "}
                you will ensure the provision of satisfactory performance to
                customers on the Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.12
                </Text>{" "}
                you will not post or transmit any content that is (or reasonably
                should be understood to be) libelous, defamatory, obscene,
                offensive (including material promoting or glorifying hate,
                violence, or bigotry or otherwise inappropriate to the community
                ethos of Cutstruct).
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.13
                </Text>{" "}
                you will not collect or mine data relating to other users of the
                Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  5.1.14
                </Text>{" "}
                you will not interfere or attempt to interfere with the proper
                working of the Website or otherwise disrupt the operations or
                violate the security of the Website. Violations of system or
                network operation or security may result in civil or criminal
                liability.
              </Text>
            </Box>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                5.2
              </Text>
              You agree to comply with all user responsibilities and obligations
              contained in these Terms. We will investigate possible occurrences
              of any violations, and we may involve the law enforcement
              authorities in prosecuting anyone involved with such violations.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                5.3
              </Text>{" "}
              Non-enforcement of any of the above terms, or our failure to act
              with respect to a breach by you does not constitute consent or
              waiver, and we reserve the right to enforce such default at our
              sole discretion. Specifically, no waiver of any breach or default
              hereunder shall be deemed to be a waiver of any preceding or
              subsequent breach or default. Nothing contained in this Agreement
              shall be construed to limit the actions or remedies available to
              us with respect to any prohibited activity or conduct.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                5.4
              </Text>{" "}
              We reserve the right to suspend or cancel your account at any
              given time at our discretion where you are in breach of these
              Terms
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                5.5
              </Text>
              You may delete your account with us provided that you duly notify
              us of same by sending the notice to support@cutstruct.com.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            6. Listing on the Website and Sale
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                6.1
              </Text>
              It will be your responsibility to list your products and materials
              on the Website, and will in this regard, include the price,
              detailed specifications, information and images of the products.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                6.2
              </Text>{" "}
              You further agree that:
            </Text>
            <Box ml={3}>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  6.2.1
                </Text>{" "}
                you will procure all licenses as may be required for the sale of
                your products on the Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  6.2.2
                </Text>{" "}
                where applicable, you will register with all tax authorities and
                render all tax returns to the appropriate authorities.
              </Text>
            </Box>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                6.3
              </Text>
              You agree that regardless of our approval of any listing on the
              Website, you will be fully responsible for the listing.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                6.4
              </Text>
              You acknowledge that we are not the producers of your products and
              we only provide you with a platform to sell them. Accordingly, you
              are not employed by Cutstruct or any of its affiliates, and the
              sale of your products on the Website is solely as independent
              person/entity.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                6.5
              </Text>
              We reserve the right to delete, unpublish, reject any listing that
              is in breach of these Terms.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                6.6
              </Text>
              Upon being notified that a customer has issued a request for
              quotation in respect of your products, you will tender a bid for
              the supply of the said products.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                6.7
              </Text>
              In selling your products on the Website, you will be required to
              provide us with photos, animations, models, or videos (jointly
              referred to as, “images”) which will be used in advertising your
              products for sale on the Website. You warrant that such images
              will not be an infringement to the intellectual property rights of
              any person whatsoever.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                6.8
              </Text>
              Once your product is bought by a customer via the website, you are
              to make such product available to us for delivery to the customer
              in the shortest possible time.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            7. Payment of Tax
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                7.1
              </Text>{" "}
              The prices of your products and materials as displayed on the
              Website shall be inclusive of Value Added Tax and other applicable
              taxes. Accordingly, you will have the responsibility to pay all
              taxes applicable to the sale of your products on the Website, and
              for the filing of returns of the taxes with the appropriate tax
              authorities.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                7.2
              </Text>{" "}
              You will indemnify and hold us harmless of any claim made against
              us by the tax authorities in respect of any statutory tax payable
              on your products or materials.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                7.3
              </Text>{" "}
              You will provide us with all necessary information and documents
              as may be requested for the purpose of identification and
              compliance with your tax obligations.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            8. Supplier's Code of Conduct
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                8.1
              </Text>{" "}
              You are required to adhere to all relevant provisions of these
              Terms and Conditions.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                8.2
              </Text>{" "}
              You represent and warrant that all information you provide to us
              will be true, accurate, current and complete. You will maintain
              the accuracy of such information and promptly update same.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                8.3
              </Text>{" "}
              You will inform us of any changes which you need to make with
              relation to the Product that will affect customers shopping
              experience.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                8.4
              </Text>{" "}
              You hereby commit to marketing your products on the Website.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                8.5
              </Text>{" "}
              You may not engage in any misleading, inappropriate, or offensive
              behaviour. This applies to all your activities on the Website,
              including:
            </Text>

            <Box ml={3}>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  a
                </Text>{" "}
                Information provided on your account
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  b
                </Text>{" "}
                Information provided in listings, content or images
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  c
                </Text>{" "}
                Communication between you and Cutstruct or you and our customers
              </Text>
            </Box>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                8.6
              </Text>{" "}
              Images used in advertising your product listings, as well as
              product descriptions, must accurately reflect the quality and
              condition of your product. Cutstruct reserves the right to request
              products be uploaded with their minimum number of Images of a
              certain format, size and resolution.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                8.7
              </Text>{" "}
              You will be required to send purchased products to our chosen
              delivery partner’s drop-off point, where a customer opts for our
              partner delivery.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                8.8
              </Text>{" "}
              You will always ensure that your product to be sold to our
              customer is in good condition and must always be fit for purpose
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            9. Prohibited Supplier Activities and Actions{" "}
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                9.1
              </Text>{" "}
              Failure to comply with these Terms can result in deactivation of
              your account and use of all our reporting tools.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                9.2
              </Text>{" "}
              Attempt to evade the established Cutstruct sales process or
              attempts to divert Cutstruct users to any website to purchase same
              products advertised on the Website is prohibited. Specifically,
              any advertisement, marketing messages (special offers) or "calls
              to action" that lead, prompt, or encourage users of the Website to
              leave the Website are prohibited. This might include the use of
              emails, hyperlinks, URLs, or web addresses within any
              seller-generated confirmation email messages or any
              product/listing description fields.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                9.3
              </Text>{" "}
              You agree not to:
            </Text>
            <Box ml={3}>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  9.3.1
                </Text>{" "}
                trick, defraud, or mislead us and other users.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  9.3.2
                </Text>{" "}
                misrepresent any information provided to us.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  9.3.3
                </Text>{" "}
                use the Website in a manner inconsistent with any applicable
                laws or regulations.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  9.3.4
                </Text>{" "}
                disparage, tarnish, or otherwise harm, in our opinion, us and/or
                the Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  9.3.5
                </Text>{" "}
                falsely imply a relationship with us or another company with
                whom you do not have a relationship.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  9.3.6
                </Text>{" "}
                solicit customers to engage in transactions outside of this
                Website. In the event that you solicit a customer for a
                transaction outside of this Website, Cutstruct shall not be
                liable in any way, shape, form, or manner to you or to the
                customer.
              </Text>
            </Box>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            10. Charges and Payment{" "}
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                10.1
              </Text>{" "}
              All proceeds of any sale concluded by you on this Website shall be
              paid by the customer, directly to an escrow account maintained by
              our escrow partners.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                10.2
              </Text>{" "}
              Our escrow partners will only disburse any amount due to you after
              2 (two) days of the Customer receiving the products, without
              initiating a dispute in respect of the quality or quantity
              received. Where the customer initiates dispute, then payment will
              only be disbursed 2 days after any such dispute is resolved. In
              the event that we are unable to resolve a dispute with the
              customer, and the customer initiates a return/refund procedure,
              then you will not be entitled to receive any payment. Also, if we
              determine that your account has been used to engage in fraud or
              other illegal activity, remittances and payments due to you might
              be withheld or forfeited.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                10.3
              </Text>{" "}
              You agree that a commission of 0.95% of the sales price is payable
              to us on all transactions carried out in respect of your products
              listed on this Website.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                10.4
              </Text>{" "}
              All payments to be disbursed to you shall be less our commission,
              as well as, any fees, charges, penalties, refunds and any other
              amounts that you owe to us in respect of any business whatsoever
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                10.5
              </Text>{" "}
              The commission rates will vary, depending on the financial value
              of the goods purchased. The commission rate will be as prescribed
              in the table below:
            </Text>
          </Box>
          <Box w="90%" m="20px auto">
            <Table>
              <Thead>
                <Tr fontWeight="bold">
                  <Td border={"1px solid #F5862E"}>S/N</Td>
                  <Td border={"1px solid #F5862E"}>Value of Goods</Td>
                  <Td border={"1px solid #F5862E"}>Rate</Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td border={"1px solid #F5862E"}>1</Td>
                  <Td border={"1px solid #F5862E"}>$0 - $150,000</Td>
                  <Td border={"1px solid #F5862E"}>0.8%</Td>
                </Tr>
                <Tr>
                  <Td border={"1px solid #F5862E"}>2</Td>
                  <Td border={"1px solid #F5862E"}>$150,000 - $500,000</Td>
                  <Td border={"1px solid #F5862E"}>0.5%</Td>
                </Tr>
                <Tr>
                  <Td border={"1px solid #F5862E"}>3</Td>
                  <Td border={"1px solid #F5862E"}>$500,000 and above</Td>
                  <Td border={"1px solid #F5862E"}>0.1%</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          {/* <br /> */}

          <Text color={"#211F5C"} fontWeight={"bold"}>
            11. Representations and Warranties
          </Text>
          <Box ml={3}>
            <Text>You hereby represent and warrant that:</Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                11.1
              </Text>{" "}
              you shall undertake such due diligence as is required for the sale
              of your products.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                11.2
              </Text>{" "}
              your products shall be in good condition and fit for purpose.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                11.3
              </Text>{" "}
              you shall comply with any applicable laws, regulations in the
              performance of your obligations hereunder. is transferred to your
              computer or mobile device. It enables us to remember your account
              log-in information, IP addresses, web traffic, number of times you
              visit, date and time of visits.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            12. Insurance
          </Text>
          <Box ml={3}>
            <Text>
              You hereby agree to maintain an insurance policy with a reputable
              insurance company acceptable to us in respect of your liabilities
              under these Terms.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            13. License
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                13.1
              </Text>{" "}
              We hereby grant you a limited, non-exclusive, non-assignable,
              non-sublicensable license to access and use the Website, and any
              user guides or specifications subject to the terms and conditions
              of these Terms.
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                13.2
              </Text>{" "}
              Under this license, except as and only to the extent any of the
              following restrictions are prohibited by applicable law or any of
              the restricted activities are permitted by the licensing terms of
              any open-sourced components incorporated into the Website, you may
              not:
            </Text>

            <Box ml={3}>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  13.2.1
                </Text>{" "}
                Under this license, except as and only to the extent any of the
                following restrictions are prohibited by applicable law or any
                of the restricted activities are permitted by the licensing
                terms of any open-sourced components incorporated into the
                Website, you may not:
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  13.2.2
                </Text>{" "}
                copy, modify, or create derivative works from the Website,
                updates, or any part of the Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  13.2.3
                </Text>{" "}
                remove or copy any copyright material or other proprietary
                notices from the Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  13.2.4
                </Text>{" "}
                transfer the content or materials from the Website to anyone
                else or “mirror” the same on any server.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  13.2.5
                </Text>{" "}
                circumvent, disable, or otherwise interfere with
                security-related features of the Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  13.2.6
                </Text>
                use any robot, spider, site search or retrieval service; or any
                other manual or automatic device or process to retrieve, index,
                data-mine, or in any way reproduce or circumvent the
                navigational structure or presentation of the Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  13.2.7
                </Text>{" "}
                harvest, collect or mine information about other users of the
                Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  13.2.8
                </Text>{" "}
                post or transmit any virus, worm, Trojan Horse, or other harmful
                or disruptive element onto the Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  13.2.9
                </Text>{" "}
                violate any applicable law, rule, or regulation in using the
                Website.
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  13.2.10
                </Text>{" "}
                use any logo or other proprietary graphic or trademark of
                Cutstruct without express written permission.
              </Text>
            </Box>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                13.3
              </Text>{" "}
              In the event of a violation of any of these restrictions (as
              determined by us), the license granted hereunder will be
              automatically revoked, and you may be liable to prosecution by the
              relevant law enforcement agencies and/or to compensate us in
              damages.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            14. Intellectual Property
          </Text>
          <Box ml={3}>
            <Text>You hereby represent and warrant that:</Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                14.1
              </Text>{" "}
              We own the copyright and other intellectual property rights in the
              Website, the Cutstruct mark, logo, combined mark and logo and
              other marks indicated on the Website (“the Cutstruct IPR”).
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                14.2
              </Text>{" "}
              You shall not copy, distribute, further develop, reproduce,
              re-publish, modify, alter, download, post, broadcast, transmit or
              make any business use of the Cutstruct IPR. You must not remove,
              alter or conceal or obscure any copyright, trademark, service mark
              or other proprietary notices regarding the Cutstruct IPR.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            15. Supplier Support
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                15.1
              </Text>{" "}
              All complaints, inquiries and requests with respect to use of the
              Website may be communicated to us via the following channels:
            </Text>
            <Text ml={5}>
              <Text as={"span"} color={"#F5862E"}>
                15.1.1
              </Text>{" "}
              Email: support@cutstruct.com
            </Text>

            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                15.2
              </Text>{" "}
              We shall use our best efforts to promptly respond to and/or
              address any complaints, inquiries and requests.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            16.Third Party Sites & Open-Source Software
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                16.1
              </Text>{" "}
              The Website may contain links to other independent third-party
              websites (“Third Party Sites”). Third Party Sites are not under
              our control, and we are not responsible for and do not endorse
              their content.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                16.2
              </Text>{" "}
              If any open-source software is included in the Website, the terms
              of an open-source license may override some of the terms set out
              in this section
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            17.Indemnification
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              You hereby agree to indemnify and hold Cutstruct harmless from and
              against any claim, suit or proceedings brought against Cutstruct
              arising from or in connection with your violation of Intellectual
              Property or other rights of third parties in relation to your use
              of the Website.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            18. Confidentiality and data privacy
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                18.1
              </Text>{" "}
              All information and documents concerning the conduct of business
              pursuant to these Terms, including information relating to
              business methods, procedures, policies and sales information, is
              strictly confidential unless it is already in the public domain.
              You shall not use Cutstruct's confidential information for any
              purpose other than to perform your obligations under this
              Agreement and you shall not disclose Cutstruct's confidential
              information without our prior written consent. complaint in order
              to address it, and your response time will impact on how quickly
              we may be able to resolve your complaint.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                18.2
              </Text>{" "}
              You will be directly responsible to buyers for any misuse of their
              personal data.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                18.3
              </Text>{" "}
              If Cutstruct is sued, fined, or otherwise incurs expenses as a
              result of the your handling of personal data obtained through the
              Website, you shall indemnify Cutstruct in respect of same.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            19. Complaints and Disputes
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                19.1
              </Text>
              If you have any formal complaint about the Website, we would like
              to resolve it as soon as possible. Please tell us about your
              complaints through the channels provided herein as soon as you can
              so that we can attend to them.complaint.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                19.2
              </Text>{" "}
              If we are unable to resolve a disagreement amicably, either of us
              can refer the dispute to the Lagos Multi-Door Courthouse (LMDC)
              for mediation, which shall be conducted in accordance with the
              LMDC Mediation Procedure Rules or such other mutually agreed
              rules.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                19.3
              </Text>{" "}
              Neither party shall be precluded from seeking any injunctive
              reliefs in the courts of law.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                19.4
              </Text>{" "}
              These terms are governed by Nigerian law and the Nigerian courts
              shall have exclusive jurisdiction to hear any claim arising out of
              or in connection with these Terms or the use of the Website.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            20. Termination
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                20.1
              </Text>{" "}
              These Terms are effective until terminated by either you or us.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                20.2
              </Text>{" "}
              You may request termination of your account at any time by sending
              an e-mail to that effect, in which event you:
            </Text>
            <Box ml={3}>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  20.2.1
                </Text>{" "}
                will be required to discontinue any further use of the Website;
                and
              </Text>
              <Text ml={2}>
                <Text as={"span"} color={"#F5862E"}>
                  20.2.2
                </Text>{" "}
                must have paid for any services we had rendered prior to the
                termination.
              </Text>
            </Box>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                20.3
              </Text>{" "}
              If you violate these Terms, any permission and/or license(s)
              granted hereunder forthe use of the Website, will automatically
              terminate.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                20.4
              </Text>{" "}
              We may, in our sole discretion, terminate these Terms and your
              access to any or all of the Website, at any time and for any
              reason.
            </Text>
            <Text ml={2}>
              <Text as={"span"} color={"#F5862E"}>
                20.5
              </Text>{" "}
              Termination of these terms shall be subject to any portions hereof
              that impliedly survive expiration or termination.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            21. Entire Agreement
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              These Terms constitute the entire agreement between you and us
              pertaining to the use of the Website. Anything contained in or
              delivered through the Website that is inconsistent with or
              conflicts with these Terms is superseded by these Terms.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            22. Severability
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              If any of the provisions of these Terms are held to be not
              enforceable by a court or other tribunal of competent
              jurisdiction, then such provisions shall be amended, limited or
              eliminated to the minimum extent necessary so that these Terms
              shall otherwise remain in full force and effect.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            23. Assignment
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              You agree that these Terms and all incorporated agreements between
              you and us may be assigned by us, in our sole discretion to any
              third party.
            </Text>
          </Box>

          <Text color={"#211F5C"} fontWeight={"bold"}>
            24. Governing Law
          </Text>
          <Box ml={3}>
            <Text ml={2}>
              These Terms shall be governed by, and construed under the laws of
              the Federal Republic of Nigeria.
            </Text>
          </Box>
        </Stack>
      </Box>
      <Box my="20px">
        <Checkbox
          onChange={(e) => setCheckedItems(e.target.checked)}
          colorScheme="orange"
        >
          <span style={{ fontSize: "14px" }}>
            I agree to the terms of service
          </span>
        </Checkbox>
      </Box>
    </div>
  );
};

export default VendorTermsConditions;
