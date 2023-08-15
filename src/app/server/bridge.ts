'use server'

import Core, {User} from "@/app/server/Core";

export async function getUser(id: string) {
    return Core.instance.getUser(id)
}

export async function search(query: string) {
    return Core.instance.searchMovie(query)
}

export async function updateUser(user: User) {
    return Core.instance.updateUser(user)
}

export async function createUser(name: string) {
    return Core.instance.createUser(name)
}

