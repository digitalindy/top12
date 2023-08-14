'use client'

import React, {FormEvent, useEffect, useState} from "react";
import {addMovie, search, setMovies} from "@/app/core/bridge";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Image,
    Stack,
    Text,
    VStack
} from "@chakra-ui/react";
import {FiArrowLeft, FiX} from "react-icons/fi";
import {HydratedMovie, HydratedUser} from "@/app/core/Core";
import {Reorder} from "framer-motion";
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList, Item} from "@choc-ui/chakra-autocomplete";

export default function Edit({user, onExit}: {
    user: HydratedUser,
    onExit: () => void}) {

    const [top, setTop] = useState<HydratedMovie[]>([])

    const [searchItems, setSearchItems] = useState<HydratedMovie[]>([]);

    const [lastSearch, setLastSearch] = useState<string>()
    const [lastSuccessSearch, setLastSuccessSearch] = useState<string>()
    const [searching, setSearching] = useState<boolean>(false)

    useEffect(() => {
        setTop(user.top)
    }, [setTop, user]);

    useEffect(() => {
        if (top.length > 0) {
            setMovies(user.id, top.map(movie => movie.id))
                .then(() => {

                })
        }

    }, [user, top]);

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
        const movie = event.item.originalValue
        setTop([movie, ...top])
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
        return top.findIndex((movie) => movie.id == optionValue.split(":")[0]) == -1
    }

    const remove = (id: number) => {
        const filtered = top.filter(movie => movie.id != id)
        setTop(Object.assign([], filtered))
    }

    return (
        <>
            <Button leftIcon={<FiArrowLeft />} onClick={onExit}>
                Back
            </Button>
            <VStack>
                <AutoComplete freeSolo
                              restoreOnBlurIfEmpty={false}
                              isLoading={searching}
                              filter={filterOutTop}
                              multiple
                              closeOnSelect={true}
                              openOnFocus={lastSuccessSearch != undefined}
                              shouldRenderSuggestions={shouldRender}
                              onSelectOption={addFromAutoComplete}>
                    <AutoCompleteInput variant="filled" />
                    <AutoCompleteList>
                        {searchItems.map((movie, oid) => (
                            <AutoCompleteItem
                                key={`option-${oid}`}
                                value={movie}
                                getValue={(value: HydratedMovie) => `${value.id}:${value.title}`}>
                                <Text ml="4">{movie.id} - {movie.title}</Text>
                            </AutoCompleteItem>
                        ))}
                    </AutoCompleteList>
                </AutoComplete>
                <Heading>Your Top Movies</Heading>

                <Reorder.Group as="ol" axis="y" values={top} onReorder={setTop}>
                    {top.map((movie) => (
                        <Reorder.Item key={movie.id} value={movie}>
                            <Card
                                direction={{ base: 'column', sm: 'row' }}
                                overflow='hidden'
                                variant='outline'
                            >
                                <Image
                                    objectFit='cover'
                                    maxW={{ base: '100%', sm: '200px' }}
                                    src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                                    alt='Caffe Latte'
                                />

                                <Stack>
                                    <CardBody>
                                        <Heading size='md'>
                                            {movie.title}
                                        </Heading>

                                        <Text py='2'>
                                            Caffè latte is a coffee beverage of Italian origin made with espresso
                                            and steamed milk.
                                        </Text>
                                    </CardBody>

                                    <CardFooter>
                                        <Button leftIcon={<FiX/>} onClick={() => remove(movie.id)}>
                                            Remove
                                        </Button>
                                        {/*<Button leftIcon={<FiX/>} onClick={() => sendTo(movie.id)}>*/}
                                        {/*    Send To*/}
                                        {/*</Button>*/}
                                    </CardFooter>
                                </Stack>
                            </Card>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </VStack>
        </>
    )
}
