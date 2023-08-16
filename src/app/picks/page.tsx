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
    PopoverTrigger, Tag, TagLabel, TagLeftIcon, TagRightIcon
} from "@chakra-ui/react";
import MovieCard from "@/app/MovieCard";
import React, {useEffect, useState} from "react";
import {randomPick, topPicks} from "@/app/server/bridge";
import {FaArrowDown, FaRectangleList, FaUserGroup} from "react-icons/fa6";
import NextLink from "next/link";

export default function Picks() {

    const [picks, setPicks] = useState<Pick[]>([])

    useEffect(() => {
        topPicks()
            .then(setPicks)

    }, [])


    if (picks.length == 0) {
        return <Center m={10}>
            <CircularProgress isIndeterminate/>
        </Center>
    }

    return (
        <>
            <Heading w='100%' size='md' my={3}>
                Friends Most Recommended
            </Heading>
            {picks.map((pick) => (
                <Box key={pick.movie.id} my={4}>
                    <MovieCard movie={pick.movie}/>
                    {pick.users.map((user) => (
                        <Link as={NextLink} key={user.id} href={`/${user.id}`}>
                        <Tag size={'sm'} mr={3} variant='outline' colorScheme='blue'>
                            <TagLeftIcon as={FaRectangleList} />
                            <TagLabel>
                                {user.name}
                            </TagLabel>
                        </Tag>
                        </Link>
                    ))}
                </Box>
            ))}
        </>
    )
}
