import axios from 'axios';


const APIKey = '1'
const Main = 'https://www.themealdb.com/api/json/v1/'

export default class Search {
    constructor (query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`${Main}${APIKey}/list.php?c=list`)
            const data = res.data.meals
            console.log(data)
        } catch(error) {
            alert(error.message)
        }
        
    
    }

}

