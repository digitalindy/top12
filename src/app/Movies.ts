import {AxiosResponse} from "axios";

export default class Movies {

    private axios = require('axios').default;

    constructor() {
    }

    search(query: string): Promise<object[]> {
        return this.get("/search/movie?query=" + query)
            .then(response => {
                return response.data.results
            })
    }

    list(user: string) {

    }

    add(user: string, id: string) {

    }

    remove(user: string, id: string) {

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