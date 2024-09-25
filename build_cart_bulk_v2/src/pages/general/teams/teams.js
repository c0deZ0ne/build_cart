import React, { useEffect, useState } from "react";
import DashboardWrapper from "../../../layouts/dashboard";
import {
  Avatar,
  Box,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Button from "../../../components/Button";
import instance from "../../../utility/webservices";
import BaseTable from "../../../components/Table";
import { RiSearch2Line } from "react-icons/ri";
import { VscTriangleRight } from "react-icons/vsc";
import Input from "../../../components/Input";
import EmptyState from "../../../components/EmptyState";
import Badge from "../../../components/Badge/Badge";
import Cards from "../../../components/Cards/Cards";
import Edit from "../../../components/Icons/Edit";
import Pause from "../../../components/Icons/Pause";
import DeleteIcon from "../../../components/Icons/Delete";
import TeamIcon from "../../../components/Icons/Team";
import AddTeam from "./addTeam";
import { capitalize } from "lodash";
import UserOctagon from "../../../components/Icons/UserOctagon";
import sentenceCase, { handleError } from "../../../utility/helpers";
import ConfirmationModal from "../../../components/Modals/ConfirmationModal";
import useModalHandler from "../../../components/Modals/SuccessModal";

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState("");
  const [member, setMember] = useState({});
  const [memberCount, setMemberCount] = useState(0);
  const [isEdit, setEdit] = useState(false);
  const [tableBody, setTableBody] = useState([]);
  const userAccount = JSON.parse(localStorage.getItem("userInfo"));
  const { handleSuccessModal, ModalComponent } = useModalHandler();

  const cardDetail = {
    description:
      "This is the total number of team members that have access to this account",
    info: true,
    name: "Team Count",
    quantity: memberCount ?? 0,
    icon: <TeamIcon fill="#12355A" opacity="1" />,
  };

  const tableColumn = [
    { name: "", icon: <UserOctagon color="#fff" /> },
    "NAME",
    "EMAIL",
    "ROLE",
    "STATUS",
    "ACTION",
  ];

  const getTeamMembers = async (teamid, search) => {
    try {
      if (teamid === "" || teamid === null || teamid === undefined) {
        setLoading(false);
        return false;
      }

      let url = `/team/${teamid}`;
      if (search) {
        url = `/team/${teamid}?search_param=${search}`;
      }

      if (teamid) {
        const { data } = (await instance.get(url)).data;
        const arr = data?.team?.teamMembers?.rows.map((item, index) => {
          let position = item?.position;

          return {
            SN: (
              <Avatar
                name={item?.user?.name}
                size="sm"
                src={item?.user?.logo}
              />
            ),
            name: capitalize(item?.user?.name),
            email: item?.user?.email,
            role: sentenceCase(item?.user?.roles[0]?.name),
            status: <Badge status={item?.user?.status} />,
            id: item?.id,
            action: position === "MEMBER" && (
              <Flex
                justify="space-between"
                gap={3}
                onClick={() => setMember(item?.user)}
              >
                <Box
                  cursor="pointer"
                  onClick={() => {
                    setEdit(true);
                    onOpen();
                  }}
                >
                  <Edit fill="#12355a" />
                </Box>
                <Box
                  cursor="pointer"
                  onClick={() =>
                    handlePause(item?.user?.id, item?.user?.status, teamid)
                  }
                >
                  {item?.user?.status === "ACTIVE" ? (
                    <Pause fill={"#FFBD00"} />
                  ) : (
                    <VscTriangleRight color="#ffbd00" fontSize="18px" />
                  )}
                </Box>
                <Box cursor="pointer" onClick={onOpenDelete}>
                  <DeleteIcon color="#EE4124" />
                </Box>
              </Flex>
            ),
          };
        });

        setTableBody(arr);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleError("Cannot get team information");
      console.log(error);
    }
  };

  const getAccountDetails = () => {
    instance
      .get(`/user/account-details?email=${userAccount?.email}`)
      .then(({ data }) => {
        let teams = "";
        if (data?.data?.teams.length > 0) {
          teams = data?.data?.teams[0];
          setTeamId(teams?.id);
          getTeamMembers(teams?.id);
          getTeamCount(teams?.id);
        } else {
          setTeamId(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setTeamId(null);
      });
  };

  useEffect(() => {
    getAccountDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTeamCount = async (teamid) => {
    const { data } = (await instance.get(`/team/${teamid}?page_size=100`)).data;

    setMemberCount(data?.team?.teamMembers?.count);
  };

  const handleSearch = async (search) => {
    setSearchTerm(search);

    getTeamMembers(teamId, search);
  };

  const handlePause = async (id, status, teamId) => {
    const action = status === "PAUSED" ? "ACTIVE" : "PAUSED";

    try {
      await instance.patch(
        `/team/update-member-status/${teamId}/${id}?status=${action}`,
      );
      handleSuccessModal("Team member has been updated");
      getTeamMembers(teamId);
    } catch (error) {
      console.log("error");
      handleError(error ?? "Error...");
    }
  };

  const handleDelete = async () => {
    try {
      await instance.delete(`/team/delete-team-member/${member?.id}/${teamId}`);
      handleSuccessModal("Team member has been deleted successfully");
      getTeamMembers(teamId);
      onCloseDelete();
    } catch (error) {
      console.log("error");
      handleError(error ?? "Error...");
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

  return (
    <DashboardWrapper pageTitle="Teams">
      <Flex direction={["column", "row"]} gap={3}>
        <Cards cardDetail={cardDetail} width="300px" />
        <Spacer />
        <Button
          onClick={() => {
            setEdit(false);
            onOpen();
          }}
        >
          Add Team Member
        </Button>
      </Flex>
      <Box my="40px" p={"32px 24px"} background={"#FCF7F6"}>
        <Flex
          direction={["column", "column", "row"]}
          justifyContent={["space-between"]}
          alignItems={["flex-start", "flex-start", "flex-end"]}
          gap={2}
        >
          <Box fontSize="22px">
            <Text fontWeight="600" color="secondary">
              Teams
            </Text>
            <Text fontSize="14px">
              Manage your Team members listed in the table below.
            </Text>
          </Box>

          <Spacer />
          <Box width="max-content" position={"relative"}>
            <Flex gap={"1rem"}>
              <Input
                placeholder="Search name or email"
                value={searchTerm}
                onChange={(e) => handleSearch(e?.target?.value)}
                leftIcon={<RiSearch2Line />}
              />
            </Flex>
          </Box>
        </Flex>

        <Box mt="20px" bg="#fff">
          <BaseTable
            tableColumn={tableColumn}
            tableBody={tableBody}
            isLoading={isLoading}
            empty={
              <EmptyState icon={<TeamIcon width="80" height="73" />}>
                <Text>
                  You do not currently have any{" "}
                  <Text as="span" color="primary">
                    team members{" "}
                  </Text>
                  on your account. Team members and their roles will appear here
                  once they are added. To add a team member,{" "}
                  <Text as="span" color="secondary">
                    click the "Add Team Member"
                  </Text>{" "}
                  button at the upper right corner of your screen.
                </Text>
              </EmptyState>
            }
          />
        </Box>
      </Box>

      {/* Add team modal component */}

      <AddTeam
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={() => {
          onClose();
          setEdit(false);
        }}
        isEdit={isEdit}
        member={member}
        teamId={teamId}
        getTeamMembers={getAccountDetails}
      />
      {/* Confirmation modal */}
      <ConfirmationModal
        isOpen={isOpenDelete}
        onOpen={onOpenDelete}
        onClose={onCloseDelete}
        handleAction={handleDelete}
        title={"Delete Team Member"}
        message="Are you sure you want to delete this team member?"
      />

      {ModalComponent}
    </DashboardWrapper>
  );
};

export default Teams;
