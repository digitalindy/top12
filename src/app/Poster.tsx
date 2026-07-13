'use client'

import {AspectRatio, Box, Center, Image, Text} from "@chakra-ui/react";
import {FaFilm} from "react-icons/fa6";
import React, {useState} from "react";
import {Movie} from "@/app/server/Core";

// tmdb posters are a fixed 2:3 aspect ratio, so reserve that space up front
// to keep card heights uniform and avoid layout shift while images load.
const POSTER_RATIO = 2 / 3

export default function Poster({movie, width}: {
    movie: Movie,
    width?: number | string | object,
}) {
    const [failed, setFailed] = useState(false)
    const showFallback = !movie.poster_path || failed

    return (
        <Box w={width} flexShrink={0}>
            <AspectRatio ratio={POSTER_RATIO}>
                {showFallback ? (
                    <PosterFallback title={movie.title}/>
                ) : (
                    <Image
                        objectFit='cover'
                        src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                        alt={movie.title}
                        onError={() => setFailed(true)}
                    />
                )}
            </AspectRatio>
        </Box>
    )
}

const PosterFallback = ({title}: { title: string }) => (
    <Center bg='gray.100' color='gray.400' flexDirection='column' p={2}>
        <FaFilm size={20}/>
        <Text mt={2} fontSize='xs' textAlign='center' lineClamp={3} color='gray.500'>
            {title}
        </Text>
    </Center>
)
