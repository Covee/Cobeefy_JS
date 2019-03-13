import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';


const state = {};
window.state = state;

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
        recipeView.renderRecipe(
            state.recipe,
            state.likes.isLiked(id)
        );
    }
}

//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// List Controller
const controlList = () => {
    if (!state.list) state.list = new List();
    
    state.recipe.ingredient.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

// Handle delete and update list item
elements.shopping.addEventListener('click', e => { 
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete', '.shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})

// Like Controller
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    let getId = state.recipe.id.split('-');
    const currentID = parseInt(getId[getId.length-1]);
    console.log(">>>>>> " + state.recipe.name)    // 끝에 id 넘버만 빼서 id로 써야 모든게 돌아감
    // 그리고 원래의 id 값도 같이 저장하고 있어야 하트리스트에서 다시 불러올때 사용할 수 있음.

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.name,
            state.recipe.source,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// All button Controllers
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe)
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
})


window.l = new List();
