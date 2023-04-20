import { Dropdown } from "@nextui-org/react";

import versionList from "../../../shared/versions";

export default function VersionsDropdown({ value, setValue }) {
    const valueArr = Array.from(value);

    const parsedName = () => {
        let count = 0;

        let mainArr = []
        let tempArr = []

        let parsedName = "";

        for(const version of versionList) {
            if(valueArr.includes(version)) {
                count++;
                tempArr.push(version)
            } else {
                if(tempArr.length > 0) {
                    mainArr.push(tempArr)
                    tempArr = []
                }

                count = 0;
            }

            if(versionList.indexOf(version) == versionList.length - 1 && tempArr.length > 0) mainArr.push(tempArr);
        }

        for(const arr of mainArr) {
            const first = arr[0];
            const last = arr[arr.length - 1];

            if(arr.length == 1) {
                parsedName += `${first}`;
            } else if(mainArr.indexOf(arr) == mainArr.length - 1) {
                parsedName += `${first} - ${last}`;
            } else {
                parsedName += `${first} - ${last}, `;
            }
        }

        return parsedName;
    }

    return (
        <Dropdown>
            <Dropdown.Button color="default" css={{ mt: 10 }}>
                {valueArr.length == 0 ? "Supported Versions" : parsedName()}
            </Dropdown.Button>
            <Dropdown.Menu selectionMode="multiple" color="secondary" selectedKeys={value} onSelectionChange={setValue}>
                {versionList.map((version) => {
                    return (
                        <Dropdown.Item key={version}>{version}</Dropdown.Item>
                    )
                })}
            </Dropdown.Menu>
        </Dropdown>
    )
}