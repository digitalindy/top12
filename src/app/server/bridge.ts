'use server'

import Core, {User} from "@/app/server/Core";

export async function listUsers() {
    return Core.instance.listUsers()
}

export async function getUser(id: string) {
    return Core.instance.getUser(id)
}

export async function searchMovie(query: string) {
    return Core.instance.searchMovie(query)
}

export async function updateUser(user: User) {
    return Core.instance.updateUser(user)
}

export async function createUser(name: string, philosophy: string) {
    return Core.instance.createUser({name: name, philosophy: philosophy})
}

export async function topRated() {
    return Core.instance.topRated()
}

export async function randomPick() {
    return Core.instance.randomPick()
}

export async function topPicks() {
    return Core.instance.topPicks()
}
