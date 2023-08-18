'use client'

import {Movie, Pick} from "@/app/server/Core";
import {
    Box,
    Button,
    Center,
    CircularProgress,
    Heading, Link,
    Popover,
    PopoverArrow, PopoverBody, PopoverCloseButton,
    PopoverContent, PopoverHeader,
    PopoverTrigger, Tag, TagLabel, TagLeftIcon
} from "@chakra-ui/react";
import MovieCard from "@/app/MovieCard";
import React, {useEffect, useState} from "react";
import {randomPick} from "@/app/server/bridge";
import {FaArrowDown, FaRectangleList, FaUserGroup} from "react-icons/fa6";
import NextLink from "next/link";

export default function TopRated() {

    const [pick, setPick] = useState<Pick>()

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
                        Thank these friends for the recommendation:
                        {pick.users.map((user) => (
                            <Link as={NextLink} key={user.id} href={`/${user.id}`}>
                                <Tag size={'sm'} ml={3} variant='outline' colorScheme='blue'>
                                    <TagLeftIcon as={FaRectangleList} />
                                    <TagLabel>
                                        {user.name}
                                    </TagLabel>
                                </Tag>
                            </Link>
                        ))}
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}
