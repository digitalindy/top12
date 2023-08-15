import 'server-only'

import {AxiosResponse} from "axios";
import {Collection, InsertOneResult, MongoClient, ObjectId, OptionalId, WithId} from "mongodb";

export interface User {
    id: string,
    name: string,
    top: Movie[]
}

export interface Movie {
    id: number
    title: string
    release_date: string
    overview: string
    poster_path: string
    vote_count: number
}

require('axios-debug-log/enable')

export default class Core {

    static instance = new Core()

    private axios = require('axios').default;

    private users: Collection<Document> | undefined = undefined

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
    }

    toUser = (doc: WithId<Document> | null): User => {
        const casted = doc as unknown as User
        return {
            id: doc!!._id.toHexString(),
            name: casted.name,
            top: casted.top
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

    createUser = async (name: string): Promise<User> => {
        await this.setup()

        return this.users!!.insertOne({
            name: name,
        } as unknown as OptionalId<Document>)
            .then((result: InsertOneResult) => (
                {
                    id: result.insertedId.toHexString(),
                    name: name,
                    top: []
                }
            ))

    }

    updateUser = async (user: User) => {
        await this.setup()

        await this.users!!.updateOne(this.userFilter(user.id), {
            $set: {
                name: user.name,
                top: user.top
            }
        })
    }

    getUser = async (id: string): Promise<User> => {
        await this.setup()

        return this.users!!.findOne(this.userFilter(id)).then(this.toUser)
    }

    randomPick = async () => {
        return this.listUsers()
            .then(users => users.map(user => user.top))
            .then(moviess => moviess.flat())
            .then(tops => (
                tops[Math.floor(Math.random() * tops.length)]
            ))
    }

    searchMovie = async (query: string): Promise<Movie[]> => {
        return this.get("/search/movie?query=" + query)
            .then(response => (
                response.data.results as Movie[]
            ))
            .then(movies => (
                movies.filter(movie => movie.vote_count > 100)
            ))
    }

    topRated = async (): Promise<Movie[]> => {
        return Promise.all(Array.from(Array(24).keys())
            .map(page => (
                this.get(`/movie/top_rated?page=${page + 1}`)
                    .then(response => (
                        response.data.results as Movie[]
                    ))
            ))).then(movies => (
                movies.flat()
            )
        )
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
