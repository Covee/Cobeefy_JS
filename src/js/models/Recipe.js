import axios from 'axios';
import { APIKey, Recipe1, Recipe2 } from '../config';


export default class Recipe {
    constructor() {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${Recipe1}${this.query}${Recipe2}${APIKey}`)

        } catch(error) {
            console.log(error)
        }
    }
}