'use client'

import React, {useEffect, useState} from "react";
import NextLink from 'next/link'
import {getUser, search, updateUser} from "@/app/core/bridge";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CircularProgress,
    Heading,
    Image,
    Link,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react'
import {FiX} from "react-icons/fi";
import {HydratedMovie, HydratedUser} from "@/app/core/Core";
import {Reorder} from "framer-motion";
import {AutoComplete, AutoCompleteInput, AutoCompleteItem, AutoCompleteList, Item} from "@choc-ui/chakra-autocomplete";

export default function Edit({params}: {
    params: { user: string }
}) {

    const [user, setUser] = useState<HydratedUser>()

    const [searchItems, setSearchItems] = useState<HydratedMovie[]>([]);

    const [lastSearch, setLastSearch] = useState<string>()
    const [lastSuccessSearch, setLastSuccessSearch] = useState<string>()
    const [searching, setSearching] = useState<boolean>(false)

    useEffect(() => {
        getUser(params.user)
            .then((user) => {
                setUser(user)
            })
    }, [params]);

    useEffect(() => {
        if (user) {
            console.log("saving user")
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
        const movie : HydratedMovie = event.item.originalValue

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
        const filtered = user!!.top.filter(movie => movie.id != id)

        user!!.top = filtered

        setUser(Object.assign({}, user))
    }

    if (user == undefined) {
        return <CircularProgress isIndeterminate color='green.300' />
    }

    return (
        <>
            <Link as={NextLink} href='/'>
                Back
            </Link>
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
                <Heading>{user.name + "'"}s Top Movies</Heading>

                <Reorder.Group as="ol" axis="y" values={user!!.top} onReorder={(top) => {
                    user!!.top = top

                    setUser(Object.assign({}, user))
                }}>
                    {user!!.top.map((movie) => (
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
