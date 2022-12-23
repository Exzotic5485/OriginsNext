import { Dropdown } from "@nextui-org/react";

import filters from "../../../shared/filters";

export default function TagDropdown({ value, setValue }) {
    const valueArr = Array.from(value);

    const disabledKeys = () => {
        if(valueArr.length < 3) return [];

        return filters.filter((filter) => !valueArr.includes(filter.value)).map((filter) => filter.value);
    }

    return (
        <Dropdown>
            <Dropdown.Button color="default">
                {valueArr.length == 0 ? "Tags" : filters.filter((f) => valueArr.includes(f.value)).map((f) => f.name).join(", ")}
            </Dropdown.Button>
            <Dropdown.Menu selectionMode="multiple" color="secondary" selectedKeys={value} onSelectionChange={setValue} disabledKeys={disabledKeys()}>
                {filters.map((filter) => {
                    return (
                        <Dropdown.Item key={filter.value}>{filter.name}</Dropdown.Item>
                    )
                })}
            </Dropdown.Menu>
        </Dropdown>
    )
}