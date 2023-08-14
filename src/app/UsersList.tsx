'use client'

import React, {useState} from "react";
import Edit from "@/app/edit/page";
import {
    Box,
    Card,
    CardBody,
    CardHeader,
    Heading,
    IconButton,
    ListItem,
    OrderedList,
    Stack,
    StackDivider
} from "@chakra-ui/react";
import {MovieCard} from "@/app/MovieCard";
import {FiEdit} from "react-icons/fi";
import {HydratedUser} from "@/app/core/Core";

export default function UsersList({users}: {users: HydratedUser[]}) {

    const [edit, setEdit] = useState<HydratedUser>()

    if (edit) {
        return <Edit user={edit} onExit={() => setEdit(undefined)}/>
    }

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
                                    <IconButton
                                        ml={3}
                                        onClick={() => setEdit(user)}
                                        aria-label='Edit'
                                        icon={<FiEdit/>}
                                    />
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
