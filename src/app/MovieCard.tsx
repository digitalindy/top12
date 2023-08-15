'use client'

import {Button, Card, CardBody, CardFooter, Flex, Heading, Image, Link, Text} from "@chakra-ui/react";
import React from "react";
import {Movie} from "@/app/server/Core";
import {FiX} from "react-icons/fi";

export default function MovieCard({movie, children}: {movie: Movie, children?: React.ReactNode}) {

    return (
        <Card
            key={`mc-${movie.id}`}
            direction='row'
            variant='outline'
            overflow='hidden'
            mb={1}
        >
            <Flex w='10%'>
                <Image
                    objectFit='contain'
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                />
            </Flex>

            <CardBody p={0} m={2}>
                <Heading size='sm'>
                    <Link href={`https://www.themoviedb.org/movie/${movie.id}`}>
                        {movie.title} ({new Date(movie.release_date).getFullYear()})
                    </Link>
                </Heading>

                <Text size='sm' noOfLines={[2, 4]}>
                    {movie.overview}
                </Text>
            </CardBody>
            <CardFooter>
                {children}
            </CardFooter>
        </Card>
    )
}