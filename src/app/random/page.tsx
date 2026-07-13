'use client'

import {Pick, User} from "@/app/server/Core";
import {
    Box,
    Button,
    Center,
    Checkbox,
    Flex,
    Heading,
    Link,
    Popover,
    Portal,
    Spinner,
    Tag
} from "@chakra-ui/react";
import MovieCard from "@/app/MovieCard";
import React, {useEffect, useState} from "react";
import {listUsers, randomPick} from "@/app/server/bridge";
import {FaArrowDown, FaRectangleList} from "react-icons/fa6";
import NextLink from "next/link";

export default function TopRated() {

    const [pick, setPick] = useState<Pick>()
    const [selected, setSelected] = useState<User[]>()
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        if (selected != undefined) return

        listUsers()
            .then(users => {
                setUsers(users)
                setSelected(users)
            })
        // run once on mount; the guard above makes `selected` a deliberate non-dependency
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selected == undefined) return

        randomPick(selected)
            .then(setPick)

    }, [selected])

    if (pick == undefined || users == undefined || selected == undefined) {
        return <Center m={10}>
            <Spinner/>
        </Center>
    }

    const setWaterPot = () => {
        setSelected(users.filter(user => ['Zack', 'Ruoxi', 'Adin', 'Jackie', 'Dave j', 'Carl', 'Michelle Kielhold', 'Sumsum’s Fav Moobies', 'Jason'].includes(user.name)))
    }

    const setAlefire = () => {
        setSelected(users.filter(user => ['Zack', 'Obrock (Ryan)', 'Jordan’s List', 'Kevin Jones', 'Jack AF', 'Scott', 'Carlo'].includes(user.name)))
    }

    return (
        <>
            <Heading w='100%' size='md' my={3}>
                A Friend{"'"}s Random Top12
            </Heading>

            <Button colorPalette={'blue'} mr={4} onClick={setWaterPot}>Only Water in da Pot</Button>
            <Button colorPalette={'blue'} onClick={setAlefire}>Only Alefire</Button>

            <Flex my={4} style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {users.map((user) => {
                    return (
                        <Flex key={user.id} style={{width: '30%', flexDirection: 'row'}}>
                            <Checkbox.Root mr={3}
                                           checked={selected.find(u => u.id == user.id) != undefined}
                                           onCheckedChange={(e) => {
                                               if (e.checked) {
                                                   setSelected([...selected, user])
                                               } else {
                                                   setSelected(selected.filter(u => u.id != user.id))
                                               }
                                           }}>
                                <Checkbox.HiddenInput/>
                                <Checkbox.Control/>
                            </Checkbox.Root>
                            {user.name}
                        </Flex>
                    )
                })}

                <Box mt={4}>
                    <MovieCard movie={pick.movie}/>
                </Box>
            </Flex>
            <Popover.Root>
                <Popover.Trigger asChild>
                    <Button colorPalette={'blue'}>See who{"'"}s list this came from <FaArrowDown/></Button>
                </Popover.Trigger>
                <Portal>
                    <Popover.Positioner>
                        <Popover.Content>
                            <Popover.Arrow/>
                            <Popover.CloseTrigger/>
                            <Popover.Body p={4}>
                                Thank these friends for the recommendation:
                                {pick.users.map((user) => (
                                    <Link asChild key={user.id}>
                                        <NextLink href={`/${user.id}`}>
                                            <Tag.Root size={'sm'} ml={3} variant='outline' colorPalette='blue'>
                                                <Tag.StartElement><FaRectangleList/></Tag.StartElement>
                                                <Tag.Label>
                                                    {user.name}
                                                </Tag.Label>
                                            </Tag.Root>
                                        </NextLink>
                                    </Link>
                                ))}
                            </Popover.Body>
                        </Popover.Content>
                    </Popover.Positioner>
                </Portal>
            </Popover.Root>
        </>
    )
}
