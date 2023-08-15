'use client'

import React, {useEffect, useState} from "react";
import NextLink from 'next/link'
import {getUser} from "@/app/server/bridge";
import {
    Alert, AlertIcon,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter, Center,
    CircularProgress,
    Heading, HStack, IconButton,
    Image,
    Link,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react'
import {FiArrowLeft, FiEdit} from "react-icons/fi";
import {User} from "@/app/server/Core";
import MovieCard from "@/app/MovieCard";

export default function Edit({params}: {
    params: { user: string }
}) {

    const [user, setUser] = useState<User>()

    useEffect(() => {
        getUser(params.user)
            .then((user) => {
                setUser(user)
            })
    }, [params]);

    if (user == undefined) {
        return (
            <Center m={10}>
                <CircularProgress isIndeterminate />
            </Center>
        )
    }

    return (
        <>
            <VStack>
                <Alert status='info' m={1} fontSize='sm'>
                    <AlertIcon boxSize={4}/>
                    Tap a movie name for more details!
                </Alert>
                <HStack w='100%'>
                    <Heading w='100%' textAlign='left' size='md'>
                        {`${user.name}'s Top Movies`}
                    </Heading>
                    <Link as={NextLink} href={`/${user.id}/edit`} legacyBehavior>
                        <Button
                            as='a'
                            m={3}
                            aria-label='Edit'
                            leftIcon={<FiEdit/>}>
                            Edit
                        </Button>
                    </Link>
                </HStack>

                <Box pt='2' fontSize='sm'>
                    {user!!.top.map((movie) => (
                        <MovieCard movie={movie} key={movie.id}/>
                    ))}
                </Box>
            </VStack>
        </>
    )
}
