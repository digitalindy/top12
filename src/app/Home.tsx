'use client'

import React from "react";
import {
    Box, Button,
    Card,
    CardBody,
    CardHeader,
    Heading,
    IconButton,
    Link,
    ListItem,
    Stack,
    StackDivider,
    Image,
    Text, AspectRatio, Center, GridItem, Grid, Flex, Alert, AlertIcon
} from "@chakra-ui/react";
import {FiEdit, FiFilm} from "react-icons/fi";
import NextLink from "next/link";
import {User} from "@/app/server/Core";
import MovieCard from "@/app/MovieCard";

export default function Home({users}: {users: User[]}) {

    return (
        <>
            <Alert status='info' m={1} fontSize='sm'>
                <AlertIcon boxSize={4}/>
                Tap a list name for a more detailed list!
            </Alert>
            {users.map((user) => (
                <Flex key={`${user.id}`} direction='column'>
                    <Heading size='md' mt={3}>
                        <Link as={NextLink} href={`/${user.id}`}>
                            {`${user.name}'s Top 12`}
                        </Link>
                    </Heading>
                    <Flex pt='2' fontSize='sm' w='100%'>
                        {user.top.map((movie, index) => (
                            <Card
                                key={`mc-${movie.id}`}
                                direction='column'
                                variant='outline'
                                overflow='hidden'
                                mb={1}
                                mr={1}
                                maxW={130}
                            >
                                <Image
                                    objectFit='contain'
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt={movie.title}
                                />

                                <CardBody p={0} m={2}>
                                    <Heading size='sm'>
                                        <Link href={`https://www.themoviedb.org/movie/${movie.id}`}>
                                            {movie.title} ({new Date(movie.release_date).getFullYear()})
                                        </Link>
                                    </Heading>
                                </CardBody>
                            </Card>
                        ))}
                    </Flex>
                </Flex>
            ))}
        </>
    )
}
