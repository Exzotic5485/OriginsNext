import { Badge, Card, Col, Divider, Input, Link, Row, Table, Text, Tooltip } from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AdminPage from "../../components/AdminPage";
import { BanIcon } from "../../components/icons/ban";
import { EyeIcon } from "../../components/icons/eye";
import SearchIcon from "../../components/icons/search";
import SendIcon from "../../components/icons/send";
import NotifyUserModal from "../../components/modals/NotifyUserModal";
import UserDetailsModal from "../../components/modals/UserDetailsModal";
import { IconButton } from "../../components/styled/IconButton";

export async function getServerSideProps(context) {
    return {
        props: {
            users: context?.query?.users || [
                {
                    id: 1,
                    username: "test",
                    email: "test@test.com",
                    role: "Admin",
                    moderator: true,
                },
            ],
        },
    };
}

export default function AdminPageUsers({}) {
    const columns = ["USERNAME", "EMAIL", "ROLE", "ACTIONS"];

    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");

    const [userDetailsModal, setUserDetailsModal] = useState({ open: false, user: null });
    const [notifyUserModalDetails, setNotifyUserModalDetails] = useState({ open: false, user: null });

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const el = document.querySelectorAll(".nextui-table-hidden-row")[1];

        if (el) el.style.display = "none";
    }, [currentPage]);

    useEffect(() => {
        axios
            .get(`/api/admin/users?search=${searchValue}`)
            .then((res) => {
                const newArr = res.data.map((user) => ({ ...user, email: `${user.username}@hidden.com` }));
                setUsers(newArr);
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to fetch users");
            });
    }, [searchValue]);

    const handleBanUser = (id) => {
        axios
            .post(`/api/admin/user/${id}/ban`)
            .then((res) => {
                toast.success("User banned");
                setUsers(users.map((user) => (user.id == id ? { ...user, banned: true } : user)));
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to ban user");
            });
    };

    const handleUnbanUser = (id) => {
        axios
            .post(`/api/admin/user/${id}/unban`)
            .then((res) => {
                toast.success("User unbanned");
                setUsers(users.map((user) => (user.id == id ? { ...user, banned: false } : user)));
            })
            .catch((err) => {
                console.log(err);
                toast.error("Failed to unban user");
            });
    };

    return (
        <AdminPage currentPage="users">
            <Card css={{ height: "max-content", mw: "800px" }}>
                <Card.Body>
                    <Text h3>Users</Text>
                    <Divider css={{ mb: 10 }} />
                    <Row css={{ mb: 10 }}>
                        <Input labelLeft={<SearchIcon height={16} />} bordered aria-label="Search" value={searchValue} onInput={(e) => setSearchValue(e.target.value)} css={{ ml: "auto" }} />
                    </Row>
                    <Table selectionMode="none" bordered headerLined lined aria-label="Users table">
                        <Table.Header>
                            {columns.map((column) => {
                                return (
                                    <Table.Column key={column.toLowerCase()} hideHeader={column == "ACTIONS"}>
                                        {column}
                                    </Table.Column>
                                );
                            })}
                        </Table.Header>
                        <Table.Body>
                            {users.map((user) => (
                                <Table.Row key={user.id}>
                                    <Table.Cell>
                                        <Link href={`/user/${user.username}`}>{user.username}</Link>
                                    </Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>
                                        {user.banned ? (
                                            <Badge color="error" variant="flat">
                                                Banned
                                            </Badge>
                                        ) : user.moderator ? (
                                            <Badge color="success" variant="flat">
                                                Moderator
                                            </Badge>
                                        ) : (
                                            <Badge color="primary" variant="flat">
                                                User
                                            </Badge>
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Row justify="center" align="center">
                                            <Col css={{ d: "flex" }}>
                                                <Tooltip content="Notify">
                                                    <IconButton onClick={() => setNotifyUserModalDetails({ open: true, user: { id: user.id, username: user.username } })}>
                                                        <SendIcon size={20} fill="#979797" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Col>
                                            <Col css={{ d: "flex" }}>
                                                <Tooltip content="User Details">
                                                    <IconButton onClick={() => setUserDetailsModal({ open: true, user })}>
                                                        <EyeIcon size={20} fill="#979797" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Col>
                                            <Col css={{ d: "flex" }}>
                                                {user.banned ? (
                                                    <Tooltip content="UnBan user" color="success">
                                                        <IconButton onClick={() => handleUnbanUser(user.id)}>
                                                            <BanIcon size={20} fill="#61F1A9" />
                                                        </IconButton>
                                                    </Tooltip>
                                                ) : (
                                                    <Tooltip content="Ban user" color="error">
                                                        <IconButton onClick={() => handleBanUser(user.id)}>
                                                            <BanIcon size={20} fill="#FF0080" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Col>
                                        </Row>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                        <Table.Pagination noMargin align="center" rowsPerPage={15} onPageChange={(p) => setCurrentPage(p)} />
                    </Table>
                </Card.Body>
            </Card>
            <UserDetailsModal info={userDetailsModal} setInfo={setUserDetailsModal} />
            <NotifyUserModal info={notifyUserModalDetails} setInfo={setNotifyUserModalDetails} />
        </AdminPage>
    );
}
