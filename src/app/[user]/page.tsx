'use client'

import React, {use, useEffect, useState} from "react";
import NextLink from 'next/link'
import {getUser} from "@/app/server/bridge";
import {
    Alert,
    Box,
    Button,
    Center,
    Heading,
    HStack,
    Separator,
    Spinner,
    Text,
    VStack
} from '@chakra-ui/react'
import {User} from "@/app/server/Core";
import MovieCard from "@/app/MovieCard";
import {FaPenToSquare} from "react-icons/fa6";

export default function Edit(props: {
    params: Promise<{ user: string }>
}) {

    const {user: userId} = use(props.params)

    const [user, setUser] = useState<User>()

    useEffect(() => {
        getUser(userId)
            .then((user) => {
                setUser(user)
            })
    }, [userId]);

    const honorableBreak = (index: number) => {
        if (index == 11) {
            return (
                <>
                    <Heading textAlign='left' w="100%" size='sm' my={2}>
                        Honorable Mentions
                    </Heading>
                    <Separator/>
                </>
            )
        }
    }

    if (user == undefined) {
        return (
            <Center m={10}>
                <Spinner/>
            </Center>
        )
    }

    return (
        <>
            <VStack>
                <Alert.Root status='info' m={1} fontSize='sm' borderRadius='lg'>
                    <Alert.Indicator/>
                    <Alert.Content>
                        Tap a movie name for more details!
                    </Alert.Content>
                </Alert.Root>
                <HStack w='100%'>
                    <Heading w='100%' textAlign='left' size='md'>
                        {`${user.name}'s Top Movies`}
                    </Heading>
                    <Button asChild m={3} aria-label='Edit'>
                        <NextLink href={`/${user.id}/edit`}>
                            <FaPenToSquare/> Edit
                        </NextLink>
                    </Button>
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

                <Box pt='2' fontSize='sm' w='100%'>
                    <Heading textAlign='left' w="100%" size='sm' my={2}>
                        Top12
                    </Heading>
                    {(user!!.top ? user!!.top : []).map((movie, index) => (
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
