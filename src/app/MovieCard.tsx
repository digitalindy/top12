'use client'

import {Card, Flex, Heading, Image, Link, Text} from "@chakra-ui/react";
import React from "react";
import {Movie} from "@/app/server/Core";

export default function MovieCard({movie, children}: { movie: Movie, children?: React.ReactNode }) {

    return (
        <Card.Root
            flexDirection='row'
            variant='outline'
            overflow='hidden'
            mb={1}
        >
            <Flex w={{base: '20%', sm: '10%'}}>
                <Image
                    objectFit='contain'
                    src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                    alt={movie.title}
                />
            </Flex>

            <Card.Body p={0}>
                <Heading size='sm' p={2}>
                    <Link href={`https://www.themoviedb.org/movie/${movie.id}`}>
                        {movie.title} ({new Date(movie.release_date).getFullYear()})
                    </Link>
                </Heading>

                <Text lineClamp={[2, 3]} px={2}>
                    {movie.overview}
                </Text>
            </Card.Body>
            <Card.Footer>
                {children}
            </Card.Footer>
        </Card.Root>
    )
}
