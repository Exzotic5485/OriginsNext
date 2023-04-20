import { Card, Text, Checkbox } from '@nextui-org/react'
import { useState } from 'react';
import filters from '../../../shared/filters'

export default function DatapackFilter({ currentFilters, router }) {
    const [selectedFilters, setSelectedFilters] = useState(currentFilters.length > 0 ? currentFilters.split(",") : [])

    const handleFilterChange = (filters) => {
        const currentPath = router.pathname
        const currentQuery = router.query

        if(filters.length == 0) {
            delete(currentQuery.filters)
        } else {
            currentQuery.filters = filters.join(",")
        }

        router.replace({
            pathname: currentPath,
            query: currentQuery
        })
        setSelectedFilters(filters)
    }

    return (
        <Card css={{}}>
          <Card.Header>
              <Text h4 size={22} color="white" css={{ m: 'auto', textAlign: 'center' }}>
                  Filters
              </Text>  
          </Card.Header>
          <Card.Body css={{ alignItems: 'center', textAlign: 'center' }}>
              <Checkbox.Group label="Tags" color='primary' value={selectedFilters} onChange={handleFilterChange}>
                  {filters.map((filter) => <Checkbox value={filter.value} key={filter.value}>{filter.name}</Checkbox>)}
              </Checkbox.Group>
          </Card.Body>
        </Card>
      );
}