'use client'

import {Card, Heading, Link, Text} from "@chakra-ui/react";
import {LuExternalLink} from "react-icons/lu";
import React from "react";
import {Movie} from "@/app/server/Core";
import Poster from "@/app/Poster";

export default function MovieCard({movie, children}: { movie: Movie, children?: React.ReactNode }) {

    return (
        <Card.Root
            flexDirection='row'
            variant='outline'
            overflow='hidden'
            mb={1}
            transition='box-shadow .2s ease'
            _hover={{boxShadow: 'md'}}
        >
            <Poster movie={movie} width={{base: 84, sm: 100}}/>

            <Card.Body p={0}>
                <Heading size='sm' p={2}>
                    <Link
                        href={`https://www.themoviedb.org/movie/${movie.id}`}
                        display='inline-flex'
                        alignItems='center'
                        gap={1}
                    >
                        {movie.title} ({new Date(movie.release_date).getFullYear()})
                        <LuExternalLink opacity={0.6}/>
                    </Link>
                </Heading>

                <Text lineClamp={[2, 3]} px={2} pb={2} color='gray.600'>
                    {movie.overview}
                </Text>
            </Card.Body>
            <Card.Footer p={2}>
                {children}
            </Card.Footer>
        </Card.Root>
    )
}
