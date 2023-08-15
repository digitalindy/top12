'use client'

import React, {useEffect, useState} from "react";
import NextLink from 'next/link'
import {getUser} from "@/app/server/bridge";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Center,
    CircularProgress,
    Divider,
    Heading,
    HStack,
    Link,
    Text,
    VStack
} from '@chakra-ui/react'
import {User} from "@/app/server/Core";
import MovieCard from "@/app/MovieCard";
import {FaPenToSquare} from "react-icons/fa6";

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

    const honorableBreak = (index: number) => {
        if (index == 11) {
            return (
                <>
                    <Heading textAlign='left' w="100%" size='sm' my={2}>
                        Honorable Mentions
                    </Heading>
                    <Divider/>
                </>
            )
        }
    }

    if (user == undefined) {
        return (
            <Center m={10}>
                <CircularProgress isIndeterminate/>
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
                            leftIcon={<FaPenToSquare/>}>
                            Edit
                        </Button>
                    </Link>
                </HStack>

                <Box w={'100%'}>
                    <Heading size='sm'>
                        Philosophy
                    </Heading>
                    <Text as='pre' pt='2' backgroundColor='white' p={3} mt={3}
                          rounded='lg'
                          whiteSpace='break-spaces'
                          fontSize='sm'>
                        {user.philosophy}
                    </Text>
                </Box>

                <Box pt='2' fontSize='sm'>
                    <Heading textAlign='left' w="100%" size='sm' my={2}>
                        Top12
                    </Heading>
                    {user!!.top.map((movie, index) => (
                        <div key={movie.id}>
                            <MovieCard movie={movie}/>
                            {honorableBreak(index)}
                        </div>
                    ))}
                </Box>
            </VStack>
        </>
    )
}
