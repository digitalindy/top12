'use client'

import {User} from "@/app/server/Core";
import {Alert, AlertIcon, Card, CardBody, Center, CircularProgress, Flex, Heading, Image, Link} from "@chakra-ui/react";
import NextLink from "next/link";
import {useEffect, useState} from "react";
import {listUsers} from "@/app/server/bridge";

export default function Index() {

    const [users, setUsers] = useState<User[]>()

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
                <CircularProgress isIndeterminate/>
            </Center>
        )
    }

    return (
        <>
            <Alert status='info' m={1} fontSize='sm' borderRadius='lg'>
                <AlertIcon boxSize={4}/>
                Tap a list name for a more detailed view!
            </Alert>
            {users.map((user) => (
                <Flex key={`${user.id}`} direction='column'>
                    <Heading size='md' mt={3}>
                        <Link as={NextLink} href={`/${user.id}`} textDecoration='underline'>
                            {`${user.name}'s Top 12`}
                        </Link>
                    </Heading>
                    <Flex pt='2' fontSize='sm' w='100%' flexWrap='wrap'>
                        {(user.top ? user.top : []).slice(0, 12).map((movie, index) => (
                            <Card
                                key={`mc-${movie.id}`}
                                direction='column'
                                variant='outline'
                                overflow='hidden'
                                mb={1}
                                mr={1}
                                w={{base: 110, sm: 118}}
                            >
                                <Image
                                    objectFit='contain'
                                    src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
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
