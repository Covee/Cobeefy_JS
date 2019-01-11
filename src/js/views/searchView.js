import { elements } from './base';

export const getInput = () => elements.searchInput.value;

const renderRecipe = recipe => {
    const markup = `
    // 여기에다가 우리가 쓰는 API 각각 넣어주면 된다.(json 한번 보고 찾아서 매칭해라)
        <li>
            <a class="results__link results__link--active" href="${recipe.}">
                <figure class="results__fig">
                    <img src="img/test-1.jpg" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">Pasta with Tomato ...</h4>
                    <p class="results__author">The Pioneer Woman</p>
                </div>
            </a>
        </li>
    `
}

export const renderResults = recipes => {
    recipes.foreach(renderRecipe)
}

