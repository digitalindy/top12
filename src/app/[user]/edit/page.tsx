'use client'

import React, {useEffect, useRef, useState} from "react";
import NextLink from 'next/link'
import {getUser, searchMovie, updateUser} from "@/app/server/bridge";
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
    FormControl,
    FormLabel,
    Heading,
    HStack,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    Link,
    Text,
    Textarea,
    useDisclosure,
    VStack
} from '@chakra-ui/react'
import {Movie, User} from "@/app/server/Core";
import {Reorder, useDragControls} from "framer-motion";
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList, Item} from "@choc-ui/chakra-autocomplete";
import MovieCard from "@/app/MovieCard";
import {FaArrowDownLong, FaArrowLeft, FaSort, FaTrash} from "react-icons/fa6";
import {BsPerson} from "react-icons/bs";
import {PHILOSOPHY_PLACEHOLDER} from "@/app/server/etc";

const ReorderItem = ({movie, onRemove, sendToBottom}: {
    movie: Movie,
    onRemove: (movie: Movie) => void,
                     sendToBottom: (movie: Movie) => void}) => {
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
            <VStack>
                <IconButton icon={<FaSort/>} aria-label="Move" size='sm' mr={3}
                            style={{touchAction: "none"}}
                            onPointerDown={(e) => {
                                controls.start(e, {snapToCursor: true})
                                e.stopPropagation()
                            }}
                />
                <IconButton icon={<FaArrowDownLong/>} aria-label="Send to Bottom" size='sm' mr={3}
                            onClick={() => sendToBottom(movie)}
                />
            </VStack>
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

    const [search, setSearch] = useState<string>()
    const [lastSearch, setLastSearch] = useState<string>()
    const [searching, setSearching] = useState<boolean>(false)
    const [canSearch, setCanSearch] = useState<boolean>(true)

    const [top, setTop] = useState<Movie[]>()

    const [saving, setSaving] = useState<boolean>(false)
    const [saved, setSaved] = useState<boolean>(false)

    const [lastSaved, setLastSaved] = useState<User>()

    useEffect(() => {
        getUser(params.user)
            .then((user) => {
                if (user.top == undefined) {
                    user.top = []
                }
                setTop(user.top)
                setUser(user)
                setLastSaved(user)
            })
    }, [params]);

    useEffect(() => {
        if (top == undefined || user == undefined || user!!.top == top) {
            return
        }

        user!!.top = top

        setUser(Object.assign({}, user))

    }, [top, user])

    useEffect(() => {
        if (!saved && !saving && user && user != lastSaved) {
            setSaving(true)
            updateUser(user)
                .then(() => {

                    setSaved(true)
                    setSaving(false)
                    setLastSaved(user)

                    //delay until next save attempt
                    setTimeout(() => {
                        //show saved message for this long
                        setSaved(false)
                    }, 4000)
                })
        }

    }, [user, lastSaved, saving, saved])

    useEffect(() => {
        if (!canSearch || !search || lastSearch == search) {
            return
        }

        setSearching(true)
        setCanSearch(false)

        const searchy = search

        searchMovie(searchy)
            .then((movies) => {
                console.log(`setting: ${movies.length}`)
                setSearchItems(movies)
                setLastSearch(searchy)
                setSearching(false)

                setTimeout(() => {
                    setCanSearch(true)
                }, 200)
            })

    }, [search, canSearch, lastSearch])

    const addFromAutoComplete = (event: { item: Item }) => {
        const movie: Movie = event.item.originalValue

        user!!.top.unshift(movie)

        setUser(Object.assign({}, user))

        return false
    }

    const shouldRender = (query: string) => {
        if (query.length > 1) {
            setSearch(query)
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

    const sendToBottom = (movie: Movie) => {
        const removed = top!!.filter(m => m.id != movie.id)
        removed.push(movie)
        setTop(removed)
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
                <Alert status='info' m={1} fontSize='sm' borderRadius='lg'>
                    <AlertIcon/>
                    Keep adding past 12 movies to add to your honorable mentions
                </Alert>
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
                        <CircularProgress isIndeterminate color='green.300' size={4} hidden={!saving} ml={2}/>
                        <Text as='span' fontSize='xs' color='green.300' ml={2} hidden={!saved}>Saved</Text>
                    </Heading>
                </HStack>
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>

                    <InputGroup>
                        <InputLeftElement>
                            <BsPerson/>
                        </InputLeftElement>
                        <Input type="text" name="name" placeholder="Your Name"
                               value={user.name}
                               backgroundColor='white'
                               onChange={(event) => {
                                   user!!.name = event.target.value
                                   setUser(Object.assign({}, user))
                               }}/>
                    </InputGroup>
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Philosophy</FormLabel>

                    <InputGroup>
                        <Textarea
                            h={130}
                            value={user.philosophy}
                            backgroundColor='white'
                            onChange={(event) => {
                                user.philosophy = event.target.value
                                setUser(Object.assign({}, user))
                            }}
                            placeholder={PHILOSOPHY_PLACEHOLDER}/>
                    </InputGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Movies</FormLabel>
                    <InputGroup>
                        <VStack w='100%'>
                        <AutoComplete freeSolo
                                      isLoading={searching}
                                      filter={filterOutTop}
                                      multiple
                                      closeOnSelect={true}
                                      openOnFocus={false}
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
                                                src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
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
                        <Heading textAlign='left' w="100%" size='sm' my={2}>
                            Top12
                        </Heading>

                        <Reorder.Group style={{listStyle: 'none'}} axis="y" values={top!!} onReorder={setTop}>
                            {top!!.map((movie, index) => (
                                <div key={movie.id}>
                                    <ReorderItem movie={movie} onRemove={remove} sendToBottom={sendToBottom}/>

                                    {honorableBreak(index)}
                                </div>
                            ))}
                        </Reorder.Group>
                        </VStack>
                    </InputGroup>
                </FormControl>
            </VStack>

        </>
    )
}
