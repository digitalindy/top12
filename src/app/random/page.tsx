'use client'

import {Pick, User} from "@/app/server/Core";
import {
    Box,
    Button,
    Center, Checkbox,
    CircularProgress, Flex,
    Heading, Link,
    Popover,
    PopoverArrow, PopoverBody, PopoverCloseButton,
    PopoverContent, PopoverHeader,
    PopoverTrigger, Tag, TagLabel, TagLeftIcon
} from "@chakra-ui/react";
import MovieCard from "@/app/MovieCard";
import React, {useEffect, useState} from "react";
import {listUsers, randomPick} from "@/app/server/bridge";
import {FaArrowDown, FaRectangleList, FaUserGroup} from "react-icons/fa6";
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
    }, []);

    useEffect(() => {
        if (selected == undefined) return

        randomPick(selected)
            .then(setPick)

    }, [selected])

    if (pick == undefined || users == undefined || selected == undefined) {
        return <Center m={10}>
            <CircularProgress isIndeterminate/>
        </Center>
    }

    const setWaterPot = () => {
        setSelected(users.filter(user => ['Zack', 'Ruoxi', 'Adin', 'Jackie', 'Dave j', 'Carl', 'Michelle Kielhold', 'Sumsum’s Fav Moobies', 'Jason'].includes(user.name)))
    }

    const setAlefire = () => {
        setSelected(users.filter(user => ['Zack', 'Obrock (Ryan)', 'Jordan’s List', 'Kevin Jones', 'Jack AF', 'Scott'].includes(user.name)))
    }

    return (
        <>
            <Heading w='100%' size='md' my={3}>
                A Friend{"'"}s Random Top12
            </Heading>

            <Button colorScheme={'blue'} mr={4} onClick={setWaterPot}>Only Water in da Pot</Button>
            <Button colorScheme={'blue'} onClick={setAlefire}>Only Alefire</Button>

            <Flex my={4} style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {users.map((user) => {
                    return (
                        <Flex key={user.id} style={{width: '30%', flexDirection: 'row'}}>
                            <Checkbox mr={3} key={user.id}
                                      isChecked={selected.find(u => u.id == user.id) != undefined}
                                      onChange={(event)=> {
                                          if (event.target.checked) {
                                              setSelected([...selected, user])
                                          } else {
                                              setSelected(selected.filter(u => u.id != user.id))
                                          }
                                      }} />
                            {user.name}
                        </Flex>
                    )
                })}

                <Box mt={4}>
                    <MovieCard movie={pick.movie}/>
                </Box>
            </Flex>
            <Popover>
                <PopoverTrigger>
                    <Button colorScheme={'blue'} rightIcon={<FaArrowDown/>}>See who{"'"}s list this came from</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody p={4}>
                        Thank these friends for the recommendation:
                        {pick.users.map((user) => (
                            <Link as={NextLink} key={user.id} href={`/${user.id}`}>
                                <Tag size={'sm'} ml={3} variant='outline' colorScheme='blue'>
                                    <TagLeftIcon as={FaRectangleList} />
                                    <TagLabel>
                                        {user.name}
                                    </TagLabel>
                                </Tag>
                            </Link>
                        ))}
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}
