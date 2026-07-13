'use client'

import {Pick} from "@/app/server/Core";
import {Box, Center, Heading, Link, Spinner, Tag} from "@chakra-ui/react";
import MovieCard from "@/app/MovieCard";
import React, {useEffect, useState} from "react";
import {topPicks} from "@/app/server/bridge";
import {FaRectangleList} from "react-icons/fa6";
import NextLink from "next/link";

export default function Picks() {

    const [picks, setPicks] = useState<Pick[]>([])

    useEffect(() => {
        topPicks()
            .then(setPicks)

    }, [])


    if (picks.length == 0) {
        return <Center m={10}>
            <Spinner/>
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
                        <Link asChild key={user.id}>
                            <NextLink href={`/${user.id}`}>
                                <Tag.Root size={'sm'} mr={3} variant='outline' colorPalette='blue'>
                                    <Tag.StartElement><FaRectangleList/></Tag.StartElement>
                                    <Tag.Label>
                                        {user.name}
                                    </Tag.Label>
                                </Tag.Root>
                            </NextLink>
                        </Link>
                    ))}
                </Box>
            ))}
        </>
    )
}
