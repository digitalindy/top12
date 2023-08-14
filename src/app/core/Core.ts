import 'server-only'

import {AxiosResponse} from "axios";
import {Collection, MongoClient, ObjectId} from "mongodb";

export interface User {
    _id: ObjectId
    name: string,
    top: string[]
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

    private users : Collection<Document> | undefined = undefined

    constructor() {}

    async setup() {
        if (this.users != undefined) {
            return Promise.resolve()
        }

        const client = new MongoClient(process.env.MONGODB_URI!!)
        await client.connect()

        const database = client.db("top12");
        this.users = database!!.collection("users");
    }

    listUsers = async (): Promise<HydratedUser[]> => {
        await this.setup()

        const users = await this.users!!.find().toArray() as unknown as User[]

        return this.hydrateUsers(users)
    }

    updateUser = async (user: HydratedUser) => {
        await this.setup()

        return this.users!!.updateOne({
            _id: ObjectId.createFromHexString(user.id)
        }, {
            $set: {
                name: user.name,
                top: user.top.map(movie => movie.id)
            }
        })
    }

    // addMovie = async (user: string, id: number) => {
    //     await this.setup()
    //
    //     return this.users!!.updateOne({
    //         _id: ObjectId.createFromHexString(user)
    //     }, {
    //         $push: { top: id}
    //     })
    // }

    hydrateUsers = (users: User[]) : Promise<HydratedUser[]> => {
        return Promise.all(users.map(async (user) => {
            return {
                id: user._id.toHexString(),
                name: user.name,
                top: await Promise.all(
                    user.top.map(this.getMovie))
            }}
        ))
    }

    getMovie = async (id: string) => {
        try {
            const response= await this.get("/movie/" + id);
            return response.data as HydratedMovie
        } catch (e) {
            return (await this.get("/movie/823754")).data as HydratedMovie;
        }
    }

    getUser = async (id: string) => {
        await this.setup()

        const slim = await this.users!!.findOne({
            _id: ObjectId.createFromHexString(id)
        }) as unknown as User

        return this.hydrateUsers([slim])
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
