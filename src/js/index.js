import axios from 'axios';


const APIKey = '1'
const Main = 'https://www.themealdb.com/api/json/v1/'

async function getResults(query) {
    const res = await axios(`${Main}${APIKey}/list.php?c=list`)
    console.log(res)

}

getResults();