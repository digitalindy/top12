'use server'

import Core from "@/app/core/Core";

export async function search(query: string) {
    return Core.instance.searchMovie(query)
}

export async function setMovies(user: string, ids: number[]) {
    return Core.instance.setMovies(user, ids)
}

export async function addMovie(user: string, id: number) {
    return Core.instance.addMovie(user, id)
}

