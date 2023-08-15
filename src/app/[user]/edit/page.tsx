'use client'

import React, {useEffect, useRef, useState} from "react";
import NextLink from 'next/link'
import {getUser, search, updateUser} from "@/app/server/bridge";
import {
    Alert,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertIcon,
    Button,
    Center,
    CircularProgress,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    Image,
    Link,
    useDisclosure,
    VStack
} from '@chakra-ui/react'
import {FiArrowLeft, FiX} from "react-icons/fi";
import {Movie, User} from "@/app/server/Core";
import {Reorder, useDragControls} from "framer-motion";
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList, Item} from "@choc-ui/chakra-autocomplete";
import MovieCard from "@/app/MovieCard";
import {FaSort} from "react-icons/fa6";

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

    const addFromAutoComplete = (event: { item: Item }) => {
        const movie: Movie = event.item.originalValue

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

    const RemoveWithConfirm = ({movie}: { movie: Movie }) => {
        const {isOpen, onOpen, onClose} = useDisclosure()
        const cancelRef = useRef<HTMLButtonElement>(null)

        const removeConfirm = () => {
            onClose()
            remove(movie.id)
        }

        return (
            <>
                <IconButton icon={<FiX/>} aria-label="Remove" size='sm' colorScheme='red'
                            onClick={onOpen}/>

                <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='sm' fontWeight='bold'>
                                Remove Movie
                            </AlertDialogHeader>

                            <AlertDialogBody>
                                Are you sure?
                            </AlertDialogBody>

                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button colorScheme='red' onClick={removeConfirm} ml={3}>
                                    Remove
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </>
        )
    }

    const ReorderItem = ({movie}: { movie: Movie }) => {
        const controls = useDragControls()

        return <Reorder.Item value={movie}
                             dragListener={false}
                             dragControls={controls}
        >
            <MovieCard movie={movie}>
                <IconButton icon={<FaSort/>} aria-label="Move" size='sm' mr={3}
                            style={{touchAction: "none"}}
                            onPointerDown={(e) => controls.start(e, {snapToCursor: true})}
                />
                <RemoveWithConfirm movie={movie}/>
            </MovieCard>
        </Reorder.Item>
    }

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
        return <Center m={10}>
            <CircularProgress isIndeterminate/>
        </Center>
    }

    return (
        <>
            <VStack>
                <Alert status='info' m={1} fontSize='sm'>
                    <AlertIcon/>
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
                    <AutoCompleteInput variant="outline" backgroundColor='white'
                                       placeholder="Start typing to add a Movie..."/>
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
                                <Flex w='90%' p={3}>
                                    <Heading
                                        size='sm'>{movie.title} ({new Date(movie.release_date).getFullYear()})</Heading>
                                </Flex>
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                </AutoComplete>

                <Reorder.Group style={{listStyle: 'none'}} axis="y" values={user!!.top} onReorder={(top) => {
                    user!!.top = top

                    setUser(Object.assign({}, user))
                }}>
                    <Heading textAlign='left' w="100%" size='sm' my={2}>
                        Top12
                    </Heading>
                    {user!!.top.map((movie, index) => (
                        <>
                            {/*<ReorderItem key={movie.id} movie={movie}/>*/}
                            <Reorder.Item key={movie.id} value={movie}>
                                <MovieCard movie={movie}>
                                    <IconButton icon={<FiX/>} aria-label="Remove" size='sm'
                                                onClick={() => remove(movie.id)}/>
                                </MovieCard>
                            </Reorder.Item>

                            {honorableBreak(index)}
                        </>
                    ))}
                </Reorder.Group>
            </VStack>
        </>
    )
}
