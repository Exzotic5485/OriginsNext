import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import toast from "react-hot-toast";

import { Card, Grid, Pagination, Row, Text, Checkbox } from "@nextui-org/react";

import Page from "../components/Page";
import SearchCard from "../components/SearchCard";
import Datapack from "../components/Datapack";
import filters from "../../shared/filters";

export async function getServerSideProps(context) {
    const { req } = context;

    return {
        props: {
            currentPage: req.query.page || 1,
            currentFilters: req.query.filters || [],
        },
    };
}

export default function DatapacksPage({ currentPage, currentFilters }) {
    const router = useRouter();
    const [page, setPage] = useState(currentPage);
    const [selectedFilters, setSelectedFilters] = useState(currentFilters.length > 0 ? currentFilters.split(",") : []);
    const [datapacks, setDatapacks] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState(new Set(["downloads"]));

    const handlePageChange = (p) => {
        /*
        window.history.pushState({}, "", `?page=${p}`);
        setPage(p);
        */

        router.replace({
            pathname: router.pathname,
            query: {
                ...router.query,
                page: p,
            },
        });

        setPage(p);
    };

    useEffect(() => {
        axios
            .get(`/api/datapacks?page=${page}&filters=${selectedFilters.join(",")}&search=${search}&sort=${Array.from(sort)[0]}`)
            .then((res) => {
                setDatapacks(res.data.datapacks);
                setTotalPages(res.data.totalPages);
            })
            .catch((e) => {
                console.log(e);
                setDatapacks([]);
                setTotalPages(1);

                toast.error(`Error fetching datapacks! Please try again.`, { duration: 3000, style: { backgroundColor: "#FF6466", color: "#FFFFFF", style: { zIndex: 1000 } } });
            });
    }, [page, selectedFilters, search, sort]);

    return (
        <Page currentPage="datapacks">
            <Grid.Container gap={2} justify="center" css={{ mt: 10 }}>
                <Grid xs={0} sm={3}>
                    <Card css={{ height: 'max-content' }}>
                        <Card.Header>
                            <Text h4 size={22} color="white" css={{ m: "auto", textAlign: "center" }}>
                                Filters
                            </Text>
                        </Card.Header>
                        <Card.Body css={{ alignItems: "center", textAlign: "center" }}>
                            <Checkbox.Group label="Tags" color="primary" value={selectedFilters} onChange={setSelectedFilters}>
                                {filters.map((filter) => (
                                    <Checkbox value={filter.value} key={filter.value}>
                                        {filter.name}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Card.Body>
                    </Card>
                </Grid>
                <Grid xs={24} sm={6} direction="column">
                    <SearchCard searchValue={search} setSearchValue={setSearch} sortValue={sort} setSortValue={setSort} />
                    {datapacks.map((datapack) => {
                        return <Datapack name={datapack.title} description={datapack.description} imageSrc={`/uploads/datapack/${datapack.image}`} slug={datapack.slug} author={datapack.owner?.username} summary={datapack.summary} downloads={datapack.downloads} key={uuidv4()} />;
                    })}
                </Grid>
            </Grid.Container>
            <Row justify="center">
                <Pagination rounded page={page} total={totalPages} initialPage={page} onChange={handlePageChange} />
            </Row>
        </Page>
    );
}
