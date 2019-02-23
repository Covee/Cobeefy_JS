import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';


const state = {};

const controlSearch = async () => {
    const query = searchView.getInput();
    // console.log(query);

    if (query) {
        state.search = new Search(query);

        searchView.clearInput();

        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        try {
            await state.search.getResults();
            clearLoader();
            searchView.renderResults(state.search.result)
        } catch(error) {
            alert(error)
            clearLoader();
        }

        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})


elements.searchResPages.addEventListener('click', e => {
     const btn = e.target.closest('.btn-inline')
     if (btn) {
         const goToPage = parseInt(btn.dataset.goto, 10)
         searchView.clearResults();
         searchView.renderResults(state.search.result, goToPage)
         
     }
})


// Recipe Controller
const controlRecipe = async() => {
    const id = window.location.hash.replace('#','');
    // console.log(id)

    if (id) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe)

        if (state.search) {
            searchView.highlightSelected(id);
        } 

        state.recipe = new Recipe(id);

        console.log(state.recipe);

        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
        
        state.recipe.calcTime()
        state.recipe.calcServings()

        clearLoader();
        recipeView.renderRecipe(state.recipe)
    }
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe)
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    }
    console.log(state.recipe)
})