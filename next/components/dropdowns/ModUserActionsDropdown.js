import { Dropdown } from "@nextui-org/react";
import swal from "sweetalert";
import { BanIcon } from "../icons/ban";
import { EditIcon } from "../icons/edit";


export default function ModUserActionsDropdown({ setEditModalVisible, userIsBanned }) {

    const handleAction = (key) => {
        switch (key) {
            case "edit":
                setEditModalVisible(true)
                break;
            case "ban":
                swal({
                    title: "Are you sure?",
                    text: "You are banning this user!",
                    icon: "warning",
                    buttons: true,
                }).then((willBan) => {
                    if (willBan) {
                        swal("User has been banned!", {
                            icon: "success",
                        });
                    }
                })
                break;
        }
    };

    return (
        <Dropdown>
            <Dropdown.Button flat size="sm" color="default" css={{ ml: "auto" }}>
                Actions
            </Dropdown.Button>
            <Dropdown.Menu color="primary" onAction={handleAction}>
                <Dropdown.Item key="edit" icon={<EditIcon />}>Edit</Dropdown.Item>
                {
                    userIsBanned ? (
                        <Dropdown.Item key="unban" color="success" icon={<BanIcon />}>Unban</Dropdown.Item>
                    ) : (
                        <Dropdown.Item key="ban" color="error" icon={<BanIcon />}>Ban</Dropdown.Item>
                    )
                }
            </Dropdown.Menu>
        </Dropdown>
    )
}