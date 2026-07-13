'use client'

import {User} from "@/app/server/Core";
import {Alert, Card, Center, Flex, Heading, Input, Link, Spinner, Text, VStack} from "@chakra-ui/react";
import NextLink from "next/link";
import {useEffect, useState} from "react";
import {listUsers} from "@/app/server/bridge";
import Poster from "@/app/Poster";

export default function Index() {

    const [users, setUsers] = useState<User[]>()
    const [filter, setFilter] = useState('')

    function shuffle(users: User[]) {
        for (var i = users.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = users[i];
            users[i] = users[j];
            users[j] = temp;
        }
        return users
    }

    useEffect(() => {
        listUsers()
            .then(users => shuffle(users))
            .then(setUsers)
    }, []);

    if (users == undefined) {
        return (
            <Center m={10}>
                <Spinner/>
            </Center>
        )
    }

    const visibleUsers = users
        .filter(user => user.top?.length > 0)
        .filter((user) => user.name.toLowerCase().includes(filter.toLowerCase()))

    return (
        <VStack align='stretch' gap={4} py={3}>
            <Alert.Root status='info' fontSize='sm' borderRadius='lg'>
                <Alert.Indicator/>
                <Alert.Content>
                    Tap a list name for a more detailed view!
                </Alert.Content>
            </Alert.Root>
            <Input
                placeholder='Filter by name...'
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                size='sm'
                borderRadius='lg'
            />

            {visibleUsers.length === 0 ? (
                <Center py={10} color='gray.500'>
                    No lists match &ldquo;{filter}&rdquo;
                </Center>
            ) : visibleUsers.map((user) => (
                <Flex key={`${user.id}`} direction='column'>
                    <Heading size='md' mb={2}>
                        <Link asChild color='blue.500'>
                            <NextLink href={`/${user.id}`}>
                                {`${user.name}'s Top 12`}
                            </NextLink>
                        </Link>
                    </Heading>
                    <Flex fontSize='sm' w='100%' flexWrap='wrap' gap={2}>
                        {user.top.slice(0, 12).map((movie) => (
                            <Card.Root
                                key={`mc-${movie.id}`}
                                flexDirection='column'
                                variant='outline'
                                overflow='hidden'
                                w={{base: 110, sm: 118}}
                                transition='box-shadow .2s ease'
                                _hover={{boxShadow: 'md'}}
                            >
                                <Poster movie={movie} width='100%'/>

                                <Card.Body p={2}>
                                    <Heading size='xs' lineHeight='short'>
                                        <Link href={`https://www.themoviedb.org/movie/${movie.id}`}>
                                            {movie.title}
                                        </Link>
                                    </Heading>
                                    <Text fontSize='xs' color='gray.500'>
                                        {new Date(movie.release_date).getFullYear()}
                                    </Text>
                                </Card.Body>
                            </Card.Root>
                        ))}
                    </Flex>
                </Flex>
            ))}
        </VStack>
    )
}
