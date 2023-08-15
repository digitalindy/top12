'use client'

import {Movie} from "@/app/server/Core";
import {
    Box,
    Button,
    Center,
    CircularProgress,
    Heading,
    Popover,
    PopoverArrow, PopoverBody, PopoverCloseButton,
    PopoverContent, PopoverHeader,
    PopoverTrigger
} from "@chakra-ui/react";
import MovieCard from "@/app/MovieCard";
import React, {useEffect, useState} from "react";
import {randomPick} from "@/app/server/bridge";
import {FaArrowDown, FaUserGroup} from "react-icons/fa6";

export default function TopRated() {

    const [pick, setPick] = useState<{movie: Movie, name: string}>()

    useEffect(() => {
        randomPick()
            .then(setPick)

    }, [])


    if (pick == undefined) {
        return <Center m={10}>
            <CircularProgress isIndeterminate/>
        </Center>
    }

    return (
        <>
            <Heading w='100%' size='md' my={3}>
                A Friend{"'"}s Random Top12
            </Heading>
            <Box my={4}>
                <MovieCard movie={pick.movie}/>
            </Box>
            <Popover>
                <PopoverTrigger>
                    <Button colorScheme={'blue'} rightIcon={<FaArrowDown/>}>See who{"'"}s list this came from</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody p={4}>
                        Thank {pick.name} for the recommendation!
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}
