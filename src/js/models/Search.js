import axios from 'axios';


const APIKey = 'a57162f6ca754e2a355fd1a67c72ea8a'
const Main = 'http://api.yummly.com/v1/api/recipes?_app_id=d4caa953&_app_key='

export default class Search {
    constructor (query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`${Main}${APIKey}&q=${this.query}&maxResult=100&start=10`)
            const data = res.data
            console.log(data)
            this.result = data
        } catch(error) {
            alert(error.message)
        }
        
        // console.log(data)
    
    }

}

