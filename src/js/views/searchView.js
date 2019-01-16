import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = ''
}

export const clearResults = () => {
    elements.searchResList.innerHTML = ''
} 

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link results__link--active" href="">
                <figure class="results__fig">
                    <img src="${recipe.smallImageUrls}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipe.sourceDisplayName}</h4>
                    <p class="results__author">${recipe.id}</p>
                </div>
            </a>
        </li>
    `
    // console.log("aaa => " + mark)
    elements.searchResList.insertAdjacentHTML('beforeend', markup)
}

export const renderResults = recipes => {
    recipes.matches.forEach(renderRecipe)
}

