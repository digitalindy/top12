'use client'

import {Movie} from "@/app/server/Core";
import {Center, CircularProgress, Heading} from "@chakra-ui/react";
import MovieCard from "@/app/MovieCard";
import React, {useEffect, useState} from "react";
import {randomPick} from "@/app/server/bridge";

export default function TopRated() {

    const [pick, setPick] = useState<Movie>()

    useEffect(() => {
        randomPick()
            .then(movie => {
                setPick(movie)
            })

    }, [])


    if (pick == undefined) {
        return <Center m={10}>
            <CircularProgress isIndeterminate/>
        </Center>
    }

    return (
        <>
            <Heading w='100%' size='md' my={3}>
                A Friend{"'"}s Random Top12
            </Heading>
            <MovieCard movie={pick}/>
        </>
    )
}
