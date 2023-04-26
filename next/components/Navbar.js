import { Image, Navbar, Text, Button, Row, Dropdown, Avatar, Badge, Link, Divider } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { NotificationIcon } from "./icons/notification";

import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";

export default function NavbarComponent({ currentPage }) {
    const [user, setUser] = useState();

    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [registerModalVisible, setRegisterModalVisible] = useState(false);

    const dropdownTriggerRef = useRef(null);

    useEffect(() => {
        axios
            .get("/api/user")
            .then(({ data }) => {
                setUser(data);
            })
            .catch((e) => {
                if (e.response.status == 401) {
                    setUser(false);
                } else {
                    toast.error("An error occurred while fetching user data.");
                }
            });
    }, [loginModalVisible]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        if (urlParams.get("loginError")) {
            toast.error("An error occurred while logging in with discord.");

            window.history.replaceState({}, document.title, window.location.pathname);
            setLoginModalVisible(true);
        }

        if (urlParams.get("notAuthenticated")) {
            window.history.replaceState({}, document.title, window.location.pathname);
            setLoginModalVisible(true);
        }
    }, []);

    const isActive = (page) => {
        return currentPage == page;
    };

    const dropdownAction = (key) => {
        switch (key) {
            case "logout":
                window.location.href = `/auth/logout?redirect=${window.location.pathname}`;
                break;
            case "profile":
                window.location.href = `/user/${user.username}`;
                break;
            case "createProject":
                window.location.href = "/datapack/new";
                break;
            case "dashboard":
                window.location.href = "/admin/users";
                break;
            case "notifications":
                dropdownTriggerRef.current.click();
                break;
        }
    };

    const notificationsAction = (key) => {
        const notification = user.notifications[key];

        if (!notification) return;

        axios
            .post("/api/user/notifications/read", { id: notification._id })
            .then(() => {
                const newNotifications = [...user.notifications];
                newNotifications.splice(key, 1);

                setUser({ ...user, notifications: newNotifications });

                if (notification.link) window.href.location = notification.link;
            })
            .catch(() => {
                toast.error("An error occurred while marking notification as read.");
            });
    };

    return (
        <Navbar isBordered variant="static">
            <Navbar.Brand>
                <Navbar.Toggle aria-label="toggle navigation" css={{ "@xs": { display: "none" } }} />
                <Image src="/img/logo.png" showSkeleton={false} height={36} width={36} />
                <Text b>Origins Datapacks</Text>
            </Navbar.Brand>
            <Navbar.Content hideIn="xs" activeColor="primary" variant="underline-rounded">
                <Navbar.Link isActive={isActive("home")} href="/">
                    Home
                </Navbar.Link>
                <Navbar.Link isActive={isActive("datapacks")} href="/datapacks">
                    Datapacks
                </Navbar.Link>
            </Navbar.Content>
            <Navbar.Content />
            <Navbar.Content hideIn="xs">
                <Row>
                    {user !== undefined ? (
                        user ? (
                            <Row css={{ gap: 10 }}>
                                <Dropdown placement="top-right">
                                    <Dropdown.Trigger css={{ display: "none", "@xs": { display: "initial" }, "@hover": { cursor: "pointer" } }}>
                                        <Navbar.Item ref={dropdownTriggerRef}>
                                            <Badge isInvisible={user?.notifications?.length == 0} disableOutline content={user?.notifications?.length} size="xs" color="error">
                                                <NotificationIcon height={32} />
                                            </Badge>
                                        </Navbar.Item>
                                    </Dropdown.Trigger>
                                    <Dropdown.Menu
                                        onAction={notificationsAction}
                                        css={{
                                            $$dropdownMenuWidth: "340px",
                                            $$dropdownItemHeight: "70px",
                                            "& .nextui-dropdown-item": {
                                                py: "$4",
                                                svg: {
                                                    color: "$secondary",
                                                    mr: "$4",
                                                },
                                                "& .nextui-dropdown-item-content": {
                                                    w: "100%",
                                                    fontWeight: "$semibold",
                                                },
                                            },
                                        }}
                                    >
                                        <Dropdown.Section title="Notifications">
                                            {user?.notifications?.length > 0 ? (
                                                user.notifications.map((notification, index) => (
                                                    <Dropdown.Item color={notification.color || "default"} key={index} showFullDescription description={notification.message}>
                                                        {notification.title}
                                                    </Dropdown.Item>
                                                ))
                                            ) : (
                                                <Dropdown.Item>
                                                    <Text>No new notifications!</Text>
                                                </Dropdown.Item>
                                            )}
                                        </Dropdown.Section>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown placement="top-right">
                                    <Dropdown.Trigger css={{ "@hover": { cursor: "pointer" } }}>
                                        <Avatar bordered={user.moderator} color={user.moderator ? "success" : "default"} size="md" src={`/uploads/user/${user.image}`} />
                                    </Dropdown.Trigger>
                                    <Dropdown.Menu onAction={dropdownAction}>
                                        <Dropdown.Item key="profile">
                                            <Text b>@{user.username}</Text>
                                        </Dropdown.Item>
                                        <Dropdown.Item css={{ display: "flex", "@xs": { display: "none" } }} key="notifications">
                                            <Text>Notifications</Text>
                                        </Dropdown.Item>
                                        <Dropdown.Item withDivider key="createProject">
                                            <Text>Create Project</Text>
                                        </Dropdown.Item>
                                        {user.moderator && (
                                            <Dropdown.Item key="dashboard">
                                                <Text>Moderation Dashboard</Text>
                                            </Dropdown.Item>
                                        )}
                                        <Dropdown.Item key="logout" color="error" withDivider>
                                            Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                        ) : (
                            <>
                                <Button auto flat onClick={() => setLoginModalVisible(true)}>
                                    Login
                                </Button>
                                <Button auto flat css={{ marginLeft: 5 }} onClick={() => setRegisterModalVisible(true)}>
                                    Signup
                                </Button>
                            </>
                        )
                    ) : (
                        <Skeleton circle width={40} height={40} baseColor="#202020" highlightColor="#444" />
                    )}
                </Row>
                {/* <Switch checked={!isDark} iconOn={<SunIcon />} iconOff={<MoonIcon />} onChange={(e) => setTheme(e.target.checked ? 'light' : 'dark')} /> */}
            </Navbar.Content>
            <Navbar.Collapse>
                <Navbar.CollapseItem>
                    <Link color="inherit" css={{ minWidth: "100%" }} href="/">
                        Home
                    </Link>
                </Navbar.CollapseItem>
                <Navbar.CollapseItem>
                    <Link color="inherit" css={{ minWidth: "100%" }} href="/datapacks">
                        Datapacks
                    </Link>
                </Navbar.CollapseItem>
                <Navbar.CollapseItem>
                    <Divider />
                </Navbar.CollapseItem>
                {user ? (
                    <>
                        <Navbar.CollapseItem>
                            <Link color="inherit" href={`/user/${user.username}`}>
                                Profile
                            </Link>
                        </Navbar.CollapseItem>
                        <Navbar.CollapseItem>
                            <Link color="inherit" href={`/user/${user.username}`}>
                                Create Project
                            </Link>
                        </Navbar.CollapseItem>
                        <Navbar.CollapseItem>
                            <Link color="error" href={`/auth/logout`}>
                                Logout
                            </Link>
                        </Navbar.CollapseItem>
                    </>
                ) : (
                    <>
                        <Navbar.CollapseItem onClick={() => setLoginModalVisible(true)}>Login</Navbar.CollapseItem>
                        <Navbar.CollapseItem onClick={() => setRegisterModalVisible(true)}>Signup</Navbar.CollapseItem>
                    </>
                )}
            </Navbar.Collapse>
            <LoginModal visible={loginModalVisible} setVisible={setLoginModalVisible} />
            <RegisterModal visible={registerModalVisible} setVisible={setRegisterModalVisible} />
        </Navbar>
    );
}
