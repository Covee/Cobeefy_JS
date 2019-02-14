import axios from 'axios';
import { APIKey, Recipe1, Recipe2 } from '../config.js';


export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    
    async getRecipe() {
        console.log(`${Recipe1}${this.id}${Recipe2}${APIKey}`);
        try {
            const res = await axios(`${Recipe1}${this.id}${Recipe2}${APIKey}`);
        
            this.name = res.data.name;
            this.source = res.data.source.sourceDisplayName;
            this.img = res.data.images.hostedMediumUrl;
            this.ingredient = res.data.ingredientLines;
            this.cookTime = parseInt(res.data.totalTimeInSeconds)/60;
            this.numberOfServings = res.data.numberOfServings;
            // console.log(res)
        } catch(error) {
            console.log(error)
            // alert("fuck you asshole")
        }
    }

    calcTime() {
        const numIng = this.ingredient.length
        const periods = Math.ceil(numIng / 3)
        this.time = periods * 15
    }

    calcServings() {
        this.servings = 4
    }


    updateServings(type) {
        const newServinges = type === 'dec' ? this.servings -1 : this.servings +1

        this.ingredient.forEach(ing => {
            ing.count *= ing.count * (newServinges / this.servings)
        })

        this.servings = newServings
    }

}