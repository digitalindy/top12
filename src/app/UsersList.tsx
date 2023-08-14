'use client'

import React from "react";
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Icon,
    Link,
    ListItem,
    OrderedList,
    Stack,
    StackDivider
} from "@chakra-ui/react";
import {MovieCard} from "@/app/MovieCard";
import {FiEdit} from "react-icons/fi";
import {HydratedUser} from "@/app/core/Core";
import NextLink from "next/link";

export default function UsersList({users}: {users: HydratedUser[]}) {

    return (
        <>
            <Card>
                <CardHeader>
                    <Heading size='md'>Your Top 12</Heading>
                </CardHeader>
                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                        {users.map((user) => (

                            <Box key={user.id}>
                                <Heading size='xs' textTransform='uppercase'>
                                    {user.name}

                                    <Link as={NextLink} href={"/" + user.id}>
                                        Edit
                                        <Icon as={FiEdit} />
                                    </Link>
                                </Heading>
                                <Box pt='2' fontSize='sm'>
                                    <OrderedList>
                                    {user.top.map((movie, index) => (
                                        <ListItem key={`mc-${movie.id}`}>
                                            <MovieCard movie={movie} />
                                        </ListItem>
                                    ))}
                                    </OrderedList>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </CardBody>
            </Card>
        </>
    )
}
