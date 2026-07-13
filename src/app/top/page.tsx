'use client'

import {Movie} from "@/app/server/Core";
import {Center, List, Spinner} from "@chakra-ui/react";
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
            <Spinner/>
        </Center>
    }

    return (
        <>
            <List.Root as='ol' pt='2' fontSize='sm'>
                {top.map((movie) => (
                    <List.Item key={movie.id}>
                        <MovieCard movie={movie}/>
                    </List.Item>
                ))}
            </List.Root>
        </>
    )
}
