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
            this.img = res.data.images[0].hostedLargeUrl;
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

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'Tbsp', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'cup','pounds', 'pound', 'grams', 'portions', 'centimeters'];
        const unitsShort = ['tbsp', 'tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'cup', 'pound', 'pound', 'gram', 'portion', 'centimeter']
        const units = [...unitsShort, 'kg', 'g']

        const fracToDec = str => { str.split('/').reduce((p, c) => p / c) }

        const newIngredients = this.ingredient.map(el => {
            // Unify units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            })

            // remove () (regex in replace method)
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // parsing ingredients
            const arrIng = ingredient.split(' ')
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2))
            let objIng;
            if (unitIndex > -1) {
                // only numbers(units) are accepted
                const arrCount = arrIng.slice(0, unitIndex)
                let count;
                if (arrCount.length === 1) {
                    eval(count = arrIng[0].replace(' ', '+'))
                } else {
                    count = eval((arrIng.slice(0, unitIndex)).join('+'))
                    // console.log(count)
                }
                
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
                
            } else if (parseInt(arrIng[0], 10)) {
                // first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng
        })
        this.ingredient = newIngredients
    }

    updateServings(type) {
        const newServings = type === 'dec' ? this.servings -1 : this.servings +1

        this.ingredient.forEach(ing => {
            ing.count *= ing.count * (newServings / this.servings)
        })

        this.servings = newServings
    }

}