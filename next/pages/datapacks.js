import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";

import { Button, Card, Col, Container, Grid, Pagination, Row, Text, Spacer, Checkbox } from "@nextui-org/react";

import Page from "../components/Page";
import SearchCard from "../components/SearchCard";
import Datapack from "../components/Datapack";
import DatapackFilter from "../components/sidebars/DatapackFilter";
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
    const [search, setSearch] = useState("");

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
        console.log(search);
        axios
            .get(`/api/datapacks?page=${page}&filters=${selectedFilters.join(",")}&search=${search}`)
            .then((res) => {
                setDatapacks(res.data);
            })
            .catch((e) => {
                console.log(e);
                setDatapacks([]);

                toast.error(`Error fetching datapacks! Please try again.`, { duration: 3000, style: { backgroundColor: "#FF6466", color: "#FFFFFF", style: { zIndex: 1000 } } });
            });
    }, [page, selectedFilters, search]);

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
                    <SearchCard searchValue={search} setSearchValue={setSearch} />
                    {datapacks.map((datapack) => {
                        return <Datapack name={datapack.title} description={datapack.description} imageSrc={`/uploads/datapack/${datapack.image}`} slug={datapack.slug} author={datapack.owner?.username} summary={datapack.summary} key={uuidv4()} />;
                    })}
                </Grid>
            </Grid.Container>
            <Row justify="center">
                <Pagination rounded page={page} total={10} initialPage={page} onChange={handlePageChange} />
            </Row>
        </Page>
    );
}
