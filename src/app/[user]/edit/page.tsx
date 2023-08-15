'use client'

import React, {RefObject, useEffect, useRef, useState} from "react";
import NextLink from 'next/link'
import {getUser, search, updateUser} from "@/app/server/bridge";
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardFooter, Center,
    CircularProgress, Flex,
    FocusLock,
    FormControl,
    FormLabel,
    forwardRef,
    Heading,
    HStack,
    IconButton,
    Image,
    Input,
    Link, NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput, NumberInputField,
    NumberInputStepper,
    Popover,
    PopoverArrow,
    PopoverCloseButton,
    PopoverContent,
    PopoverTrigger,
    Stack,
    Text,
    useDisclosure,
    VStack
} from '@chakra-ui/react'
import {FiArrowLeft, FiList, FiX} from "react-icons/fi";
import {Movie, User} from "@/app/server/Core";
import {Reorder} from "framer-motion";
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList, Item} from "@choc-ui/chakra-autocomplete";
import {EditIcon} from "@chakra-ui/icons";
import MovieCard from "@/app/MovieCard";

export default function Edit({params}: {
    params: { user: string }
}) {

    const [user, setUser] = useState<User>()

    const [searchItems, setSearchItems] = useState<Movie[]>([]);

    const [lastSearch, setLastSearch] = useState<string>()
    const [lastSuccessSearch, setLastSuccessSearch] = useState<string>()
    const [searching, setSearching] = useState<boolean>(false)

    useEffect(() => {
        getUser(params.user)
            .then((user) => {
                if (user.top == undefined) {
                    user.top = []
                }
                setUser(user)
            })
    }, [params]);

    useEffect(() => {
        if (user) {
            updateUser(user)
                .then(() => {
                    //todo alert saved
                })
        }

    }, [user]);

    useEffect(() => {
        if (searching || lastSuccessSearch == lastSearch) {
            return
        }

        setSearching(true)

        const searchy = lastSearch!!

        search(searchy)
            .then((movies) => {
                setSearchItems(movies)
                setLastSuccessSearch(searchy)

                setTimeout(() => {
                    setSearching(false)
                }, 200)
            })

    }, [lastSearch, searching, lastSuccessSearch])

    const addFromAutoComplete = (event: {item: Item}) => {
        const movie : Movie = event.item.originalValue

        user!!.top.unshift(movie)

        setUser(Object.assign({}, user))

        return false
    }

    const shouldRender = (query: string) => {
        if (query.length > 1) {
            setLastSearch(query)
            return true
        }

        return false
    }

    const filterOutTop = (query: string, optionValue: Item["value"], optionLabel: Item["label"]) => {
        return user!!.top.findIndex((movie) => movie.id == optionValue.split(":")[0]) == -1
    }

    const remove = (id: number) => {
        user!!.top = user!!.top.filter(movie => movie.id != id)

        setUser(Object.assign({}, user))
    }

    if (user == undefined) {
        return <Center m={10}>
            <CircularProgress isIndeterminate />
        </Center>
    }

    return (
        <>
            <VStack>
                <Alert status='info' m={1}>
                    <AlertIcon />
                    Arrange your movies by dragging them!
                </Alert>
                <HStack w='100%'>
                    <Link as={NextLink} href={`/${user.id}`} legacyBehavior
                          alignSelf='start'
                    >
                        <Button
                            as='a'
                            m={3}
                            aria-label='Back'
                            leftIcon={<FiArrowLeft/>}>
                            Back
                        </Button>
                    </Link>
                    <Heading textAlign='left' w="100%" size='md'>
                        Edit {user.name + "'"}s Movies
                    </Heading>
                </HStack>
                <AutoComplete freeSolo
                              restoreOnBlurIfEmpty={false}
                              isLoading={searching}
                              filter={filterOutTop}
                              multiple
                              closeOnSelect={true}
                              openOnFocus={lastSuccessSearch != undefined}
                              shouldRenderSuggestions={shouldRender}
                              onSelectOption={addFromAutoComplete}>
                    <AutoCompleteInput variant="outline" backgroundColor='white' placeholder="Start typing to add a Movie..."  />
                    <AutoCompleteList>
                        {searchItems.map((movie, oid) => (
                            <AutoCompleteItem
                                key={`option-${oid}`}
                                value={movie}
                                getValue={(value: Movie) => `${value.id}:${value.title}:${new Date(value.release_date).getFullYear()}`}>
                                <Flex w='10%'>
                                    <Image
                                        objectFit='contain'
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                </Flex>
                                <Flex w='90%'>
                                    <Text>{movie.title} ({new Date(movie.release_date).getFullYear()})</Text>
                                </Flex>
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                </AutoComplete>

                <Reorder.Group style={{listStyle: 'none'}} axis="y" values={user!!.top} onReorder={(top) => {
                    user!!.top = top

                    setUser(Object.assign({}, user))
                }}>
                    {user!!.top.map((movie) => (
                        <Reorder.Item key={movie.id} value={movie}>
                            <MovieCard movie={movie}>
                                <IconButton icon={<FiX/>} aria-label="Remove" size='sm'
                                            onClick={() => remove(movie.id)} />
                            </MovieCard>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </VStack>
        </>
    )
}
