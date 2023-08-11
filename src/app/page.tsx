import 'server-only'

import Image from 'next/image'
import styles from './page.module.css'
import { Box } from '@radix-ui/themes';
import Movies from "@/app/Movies";
import MoviesList from "@/app/MoviesList";

const movies = new Movies()

export default async function Home() {
  const search = await movies.search('what')

  return (
    <MoviesList movies={search} />
  )
}
