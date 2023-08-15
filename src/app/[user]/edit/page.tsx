'use client'

import React, {useEffect, useRef, useState} from "react";
import NextLink from 'next/link'
import {getUser, search, updateUser} from "@/app/server/bridge";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
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
    Text,
    useDisclosure,
    VStack
} from '@chakra-ui/react'
import {Movie, User} from "@/app/server/Core";
import {Reorder, useDragControls} from "framer-motion";
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList, Item} from "@choc-ui/chakra-autocomplete";
import MovieCard from "@/app/MovieCard";
import {FaArrowLeft, FaSort, FaTrash} from "react-icons/fa6";

const ReorderItem = ({movie, onRemove}: { movie: Movie, onRemove: (movie: Movie) => void }) => {
    const controls = useDragControls()

    const {isOpen, onOpen, onClose} = useDisclosure()
    const cancelRef = useRef<HTMLButtonElement>(null)

    const removeConfirm = () => {
        onClose()
        onRemove(movie)
    }

    return <Reorder.Item value={movie}
                         key={`${movie.id}`}
                         id={`${movie.id}`}
                         dragListener={false}
                         dragControls={controls}
    >
        <MovieCard movie={movie}>
            <IconButton icon={<FaSort/>} aria-label="Move" size='sm' mr={3}
                        style={{touchAction: "none"}}
                        onPointerDown={(e) => controls.start(e, {snapToCursor: true})}
            />
            <IconButton icon={<FaTrash/>} aria-label="Remove" size='sm' colorScheme='red'
                        onClick={onOpen}/>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='sm' fontWeight='bold'>
                            Remove {movie.title}
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
        </MovieCard>
    </Reorder.Item>
}

export default function Edit({params}: {
    params: { user: string }
}) {

    const [user, setUser] = useState<User>()

    const [searchItems, setSearchItems] = useState<Movie[]>([]);

    const [lastSearch, setLastSearch] = useState<string>()
    const [lastSuccessSearch, setLastSuccessSearch] = useState<string>()
    const [searching, setSearching] = useState<boolean>(false)

    const [top, setTop] = useState<Movie[]>()

    useEffect(() => {
        getUser(params.user)
            .then((user) => {
                if (user.top == undefined) {
                    user.top = []
                }
                setTop(user.top)
                setUser(user)
            })
    }, [params]);

    useEffect(() => {
        if (top == undefined || user == undefined || user!!.top == top) {
            return
        }

        user!!.top = top

        setUser(Object.assign({}, user))

    }, [top, user]);

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

        console.log(searchy)
        search(searchy)
            .then((movies) => {
                console.log(movies)
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

    const remove = (movie: Movie) => {
        setTop(top!!.filter(m => m.id != movie.id))
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
                {/*<Alert status='info' m={1} fontSize='sm'>*/}
                {/*    <AlertIcon/>*/}
                {/*    Arrange your movies by dragging them!*/}
                {/*</Alert>*/}
                <HStack w='100%'>
                    <Link as={NextLink} href={`/${user.id}`} legacyBehavior
                          alignSelf='start'
                    >
                        <Button
                            as='a'
                            m={3}
                            aria-label='Back'
                            leftIcon={<FaArrowLeft/>}>
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
                    <AutoCompleteList py={2}>
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
                                <VStack w='90%' p={2}>
                                    <Heading
                                        w='100%'
                                        textAlign='left'
                                        size='sm'>{movie.title} ({new Date(movie.release_date).getFullYear()})</Heading>
                                    <Text size='sm' noOfLines={3}>{movie.overview}</Text>
                                </VStack>
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                </AutoComplete>

            </VStack>
            <Reorder.Group style={{listStyle: 'none'}} axis="y" values={top!!} onReorder={setTop}>
                <Heading textAlign='left' w="100%" size='sm' my={2}>
                    Top12
                </Heading>
                {top!!.map((movie, index) => (
                    <div key={movie.id}>
                        <ReorderItem movie={movie} onRemove={remove}/>

                        {honorableBreak(index)}
                    </div>
                ))}
            </Reorder.Group>
        </>
    )
}
