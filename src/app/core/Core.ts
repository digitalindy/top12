import 'server-only'

import {AxiosResponse} from "axios";
import {Db, MongoClient, ObjectId} from "mongodb";

export interface User {
    _id: ObjectId
    name: string,
    top: {
       id: string
    }[]
}

export interface Movie {
    _id: ObjectId
    id: number
    title: string
    release_date: string
    overview: string
    poster_path: string
}

export interface HydratedUser {
    id: string
    name: string
    top: HydratedMovie[]
}

export interface HydratedMovie {
    id: number,
    title: string,
}

require('axios-debug-log/enable')

export default class Core {

    static instance = new Core()


    private axios = require('axios').default;
    private database: Db | undefined = undefined

    constructor() {}

    async setup() {
        if (this.database != undefined) {
            return Promise.resolve()
        }

        const client = new MongoClient(process.env.MONGODB_URI!!)
        await client.connect()

        this.database = client.db("top12");

        console.log(`Successfully connected to database: ${this.database.databaseName}`);
    }

    async listUsers(): Promise<User[]> {
        await this.setup()

        const users = this.database!!.collection("users");

        return await users.find().toArray() as User[]
    }

    setMovies = async (user: string, ids: number[]) => {
        await this.setup()

        const users = this.database!!.collection("users");
        return users.updateOne({
            _id: ObjectId.createFromHexString(user)
        }, {
            $set: {top: ids}
        })
    }

    addMovie = async (user: string, id: number) => {
        await this.setup()

        const users = this.database!!.collection("users");
        return users.updateOne({
            _id: ObjectId.createFromHexString(user)
        }, {
            $push: { top: id}
        })
    }

    hydrateUser = (users: User[]) : Promise<HydratedUser[]> => {
        return Promise.all(users.map(async (user) => {
            return {
                id: user._id.toHexString(),
                name: user.name,
                top: await Promise.all(user.top.map(async (id) => {
                    try {
                        const response= await this.get("/movie/" + id);
                        return response.data as HydratedMovie
                    } catch (e) {
                        return (await this.get("/movie/823754")).data as HydratedMovie;
                    }
                }))
            }}
        ))
    }

    searchMovie = async (query: string): Promise<HydratedMovie[]> => {
        return this.get("/search/movie?query=" + query)
            .then(response => (
                response.data.results as HydratedMovie[]
            ))
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
