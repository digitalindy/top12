'use client'

import {Card, CardBody, CardFooter, Flex, Heading, Image, Link, Text} from "@chakra-ui/react";
import React from "react";
import {Movie} from "@/app/server/Core";

export default function MovieCard({movie, children}: { movie: Movie, children?: React.ReactNode }) {

    return (
        <Card
            key={`mc-${movie.id}`}
            direction='row'
            variant='outline'
            overflow='hidden'
            mb={1}
        >
            <Flex w={{base: '20%', sm: '10%'}}>
                <Image
                    objectFit='contain'
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                />
            </Flex>

            <CardBody p={0}>
                <Heading size='sm' p={2}>
                    <Link href={`https://www.themoviedb.org/movie/${movie.id}`}>
                        {movie.title} ({new Date(movie.release_date).getFullYear()})
                    </Link>
                </Heading>

                <Text size='sm' noOfLines={[2, 3]} px={2}>
                    {movie.overview}
                </Text>
            </CardBody>
            <CardFooter>
                {children}
            </CardFooter>
        </Card>
    )
}