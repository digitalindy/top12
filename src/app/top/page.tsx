'use client'

import {Movie} from "@/app/server/Core";
import {Center, CircularProgress, ListItem, OrderedList} from "@chakra-ui/react";
import MovieCard from "@/app/MovieCard";
import React, {useEffect, useState} from "react";
import {topRated} from "@/app/server/bridge";

export default function TopRated() {

    const [top, setTop] = useState<Movie[]>()

    useEffect(() => {
        topRated()
            .then(movies => {
                setTop(movies)
            })

    }, [])


    if (top == undefined) {
        return <Center m={10}>
            <CircularProgress isIndeterminate/>
        </Center>
    }

    return (
        <>
            <OrderedList pt='2' fontSize='sm'>
                {top.map((movie) => (
                    <ListItem key={movie.id}>
                        <MovieCard movie={movie}/>
                    </ListItem>
                ))}
            </OrderedList>
        </>
    )
}
