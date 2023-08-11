import Image from 'next/image'
import styles from './page.module.css'
import React from "react";
import { Box } from '@radix-ui/themes';
import Movies from "@/app/Movies";

export default function MoviesList({movies}: {movies: object[]}) {

    return (
        <div>{movies.length}</div>
    )
}
