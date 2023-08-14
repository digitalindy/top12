'use server'

import Core, {HydratedUser} from "@/app/core/Core";

export async function getUser(id: string) {
    return Core.instance.getUser(id).then(users => users[0])
}

export async function search(query: string) {
    return Core.instance.searchMovie(query)
}

export async function getMovie(id: string) {
    return Core.instance.getMovie(id)
}

export async function updateUser(user: HydratedUser) {
    return Core.instance.updateUser(user)
}

