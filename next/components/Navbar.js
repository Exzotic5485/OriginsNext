import { Image, Navbar, Switch, Text, useTheme, Button, Row, Dropdown, Avatar } from "@nextui-org/react";
import axios from "axios";
import { useTheme as useNextTheme } from "next-themes";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import LoginModal from "./modals/LoginModal";
import RegisterModal from "./modals/RegisterModal";

export default function NavbarComponent({ currentPage }) {
    const [user, setUser] = useState();

    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [registerModalVisible, setRegisterModalVisible] = useState(false);

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
                    toast.error("An error occurred while fetching user data.")
                }
            });
    }, [loginModalVisible]);

    useEffect(() => console.log(user), [user])

    const isActive = (page) => {
        return currentPage == page;
    };


    const dropdownAction = (key) => {
        switch (key) {
            case "logout":
                window.location.href = `/auth/logout?redirect=${window.location.pathname}`;
                break;
            case "profile":
                window.location.href = "/profile";
                break;
            case "createProject":
                window.location.href = "/datapack/new";
                break;
        }
    };

    return (
        <Navbar isBordered variant="static">
            <Navbar.Brand>
                <Image src="/img/logo.png" showSkeleton={false} height={36} width={36} />
                <Text b>Site</Text>
            </Navbar.Brand>
            <Navbar.Content activeColor="primary" variant="underline-rounded">
                <Navbar.Link isActive={isActive("home")} href="/">
                    Home
                </Navbar.Link>
                <Navbar.Link isActive={isActive("datapacks")} href="/datapacks">
                    Datapacks
                </Navbar.Link>
            </Navbar.Content>
            <Navbar.Content />
            <Navbar.Content>
                <Row>
                    {user !== undefined ? (
                        user ? (
                            <Dropdown placement="top-right">
                                <Dropdown.Trigger>
                                    <Avatar bordered={user.moderator} color={user.moderator ? "gradient" : "default"} size="md" src={`/uploads/user/${user.image}`} />
                                </Dropdown.Trigger>
                                <Dropdown.Menu onAction={dropdownAction}>
                                    <Dropdown.Item key="profile">
                                        <Text b>@{user.username}</Text>
                                    </Dropdown.Item>
                                    <Dropdown.Item withDivider key="createProject">
                                        <Text>Create Project</Text>
                                    </Dropdown.Item>
                                    <Dropdown.Item key="logout" color="error" withDivider>
                                        Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
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
            <LoginModal visible={loginModalVisible} setVisible={setLoginModalVisible} />
            <RegisterModal visible={registerModalVisible} setVisible={setRegisterModalVisible} />
        </Navbar>
    );
}
