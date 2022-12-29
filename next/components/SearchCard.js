import { Card, Dropdown, Input, Text } from '@nextui-org/react'
import SearchIcon from './icons/search'

export default function SearchCardComponent({ searchValue, setSearchValue, sortValue, setSortValue }) {
    return (
        <Card css={{ mb: 10, height: 'fit-content', flexDirection: 'row' }}>
            <Card.Body css={{flexDirection: "row", justifyContent: "center"}}>
                <Input bordered value={searchValue} onChange={(e) => setSearchValue(e.target.value)} labelLeft={<SearchIcon />} css={{ mh: 40, mw: 300, alignSelf: "center"}} placeholder='Search Datapacks...' aria-label='Search Datapacks'/>
                <Dropdown closeOnSelect={false}>
                    <Dropdown.Button flat size="md" css={{ width: 25, height: 30, ml: 'auto', alignSelf: 'center' }}>
                        Sort
                    </Dropdown.Button>
                    <Dropdown.Menu selectionMode='single' selectedKeys={sortValue} onSelectionChange={setSortValue} disallowEmptySelection>
                        <Dropdown.Item key="downloads">
                            Downloads
                        </Dropdown.Item>
                        <Dropdown.Item key="likes">
                            Likes
                        </Dropdown.Item>
                        <Dropdown.Item key="created">
                            Newest
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Card.Body>
        </Card>
    )
}