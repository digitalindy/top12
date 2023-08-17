import 'server-only'

import {AxiosResponse} from "axios";
import {Collection, InsertManyResult, InsertOneResult, MongoClient, ObjectId, OptionalId, WithId} from "mongodb";

export interface User {
    id: string,
    name: string,
    philosophy: string,
    top: Movie[]
}

export interface Movie {
    id: number
    order: number
    title: string
    release_date: string
    overview: string
    poster_path: string
    vote_count: number
    vote_average: number
}

export interface Pick {
    movie: Movie,
    users: User[]
}

require('axios-debug-log/enable')

export default class Core {

    static instance = new Core()

    private axios = require('axios').default;

    private users: Collection<Document> | undefined = undefined
    private topRatedc: Collection<Document> | undefined = undefined

    constructor() {
    }

    async setup() {
        if (this.users) {
            return Promise.resolve()
        }

        const client = new MongoClient(process.env.MONGODB_URI!!)
        await client.connect()

        const database = client.db("top12");
        this.users = database!!.collection("users");
        this.topRatedc = database!!.collection("top_rated");
    }

    toUser = (doc: WithId<Document> | null): User => {
        const casted = doc as unknown as User
        return {
            id: doc!!._id.toHexString(),
            name: casted.name,
            philosophy: casted.philosophy,
            top: casted.top?.sort((a, b) => a.order - b.order)
        }
    }

    userFilter = (id: string) => ({
        _id: ObjectId.createFromHexString(id)
    })

    listUsers = async (): Promise<User[]> => {
        await this.setup()

        return this.users!!.find()
            .toArray()
            .then(users => users.map(this.toUser))
    }

    createUser = async (user: { name: string, philosophy: string }): Promise<User> => {
        await this.setup()

        return this.users!!.insertOne({
            name: user.name,
            philosophy: user.philosophy
        } as unknown as OptionalId<Document>)
            .then((result: InsertOneResult) => (
                {
                    id: result.insertedId.toHexString(),
                    name: user.name,
                    philosophy: user.philosophy,
                    top: []
                }
            ))

    }

    updateUser = async (user: User) => {
        await this.setup()

        await this.users!!.updateOne(this.userFilter(user.id), {
            $set: {
                name: user.name,
                philosophy: user.philosophy,
                top: user.top.map((movie, index) => {
                    movie.order = index
                    return movie
                })
            }
        })
    }

    getUser = async (id: string): Promise<User> => {
        await this.setup()

        return this.users!!.findOne(this.userFilter(id)).then(this.toUser)
    }

    randomPick = async (): Promise<{movie: Movie, name: string}> => {
        await this.setup()

        return this.listUsers()
            .then(users => users.map(user => ({top: user.top, name: user.name})))
            .then(users => (
                users[Math.floor(Math.random() * users.length)]
            ))
            .then(user => (
                {
                    movie: user.top[Math.floor(Math.random() * user.top.length)],
                    name: user.name
                }
            ))
    }

    topPicks = async (): Promise<Pick[]> => {
        await this.setup()

        return this.listUsers()
            .then(users => users.map(user => ({top: user.top, name: user})))
            .then(users => (
                users.flatMap(user => (
                    user.top.map(movie => ({ movie: movie, users: [user.name] }))
                ))
                    .sort((a, b) => a.movie.id - b.movie.id)
                    .reduce<Pick[]>((previousValue, currentValue) => {
                            if (previousValue.length > 0 && previousValue[previousValue.length - 1].movie.id == currentValue.movie.id) {
                                return [{ movie: currentValue.movie, users: [...previousValue.pop()!!.users, ...currentValue.users]}, ...previousValue]
                            }

                            return [...previousValue, currentValue]
                        }, [])
                    .flat()
                    .sort((a, b) => b.users.length - a.users.length)
                    .filter(pick => pick.users.length > 1)
            ))
    }

    searchMovie = async (query: string): Promise<Movie[]> => {
        return Promise.all(Array.from(Array(2).keys())
            .map(page => (
                this.get(`/search/movie?page=${page + 1}&query=` + query)
                    .then(response => {
                        return response.data.results as Movie[]
                    })
                    .then(movies => (
                        movies.filter(movie => movie.vote_count > 50)
                    ))
            ))).then(movies => movies.flat())
    }

    topRated = async (): Promise<Movie[]> => {
        await this.setup()

        if (await this.topRatedc?.countDocuments() == 0) {
            const top = await Promise.all(Array.from(Array(50).keys())
                .map(page => (
                    this.get(`/movie/top_rated?region=US&page=${page + 1}`)
                        .then(response => (
                            response.data.results as Movie[]
                        ))
                ))).then(movies => (
                    movies.flat()
                )
            )

            await this.topRatedc!!.insertMany(top.map(movie => movie as unknown as Document))
        }

        return this.topRatedc!!.find().toArray()
            .then(movies => movies.map(movie => {
                delete (movie as any)['_id']
                return movie as unknown as Movie
            }))
            .then(movies => {
                return movies.sort((a, b) => (
                    b.vote_average - a.vote_average
                ))
            })
    }

    get = async (url: string): Promise<AxiosResponse> => {
        const headers: { [name: string]: string } = {
            'Accept': 'application/json',
            'Authorization': 'Bearer ${process.env.TMDB_TOKEN}'
        }

        return this.axios({
            url: "https://api.themoviedb.org/3/" + url,
            method: 'get',
            headers: headers
        })
    }
}
