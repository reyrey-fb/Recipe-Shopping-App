import {elements} from './base';

//get query input from user UI
export const getInput= () => elements.searchInput.value;

//clear the UI search input after user enters it
export const clearInput = () => {
    elements.searchInput.value = '';
};

//clear results from the previous search by deleting the HTML generated for those recipe results
export const clearResults = () => {
    elements.searchResList.innerHTML = ''; //clears recipe results
    elements.searchResPages.innerHTML = ''; //clears pagination buttons
};

//highlight whichever search item is selected
export const highlightSelected = id => {
    //remove active class from all search results first
    const resultsArr = Array.from(document.querySelectorAll(".results__link"));
    resultsArr.forEach(el => {
        el.classList.remove("results__link--active");
    });
    //css selector reads select links in the results__link class with a # and ID, and add active class
    document.querySelector(`.results__link[href="#${id}"]`).classList.add("results__link--active");
};

//private function to truncate titles into one line (17 characters) in UI
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        //split title into an array of its different words, so no word is ever cut off in the middle
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        },0); //initial value of accumulator set to 0

        //return the result (join method glues together items of an array)
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

//private function created just to feed into renderResults & display each recipe
const renderRecipe = recipe =>{
    //replace static html data with data object properties from API
    const markup = `
    <li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${recipe.title}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>
    `;

    //push li item element to the ul parent element in html doc/the DOM
    elements.searchResList.insertAdjacentHTML('beforeend', markup);

};

//private function that feeds into renderButton that just returns HTML markup for buttons
//generates different buttons and numbers depending on type - prev or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1}>
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"}"></use>
        </svg>
    </button>
     `;

//private function that feeds into renderResults for displaying page 1 button for page 1, etc
const renderButtons = (page, numResults, resPerPage) => {
  //calc how many total pages there are (round to ceiling integer)
  const pages = Math.ceil(numResults / resPerPage);
  let button; //declared here to avoid block scope issue

  if (page === 1 && pages > 1) {
    // Only button to go to next page
    button = createButton(page, "next");
  } else if (page < pages) {
    // Both buttons
    button = `
            ${createButton(page, "prev")}
            ${createButton(page, "next")}
        `;
  } else if (page === pages && pages > 1) {
    // Only button to go to prev page
    button = createButton(page, "prev");
  }

  //attach the button element to the DOM
  elements.searchResPages.insertAdjacentHTML("afterbegin", button);
};


//display recipe results to UI on correct page (pagination)
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //1. render results of current page
   const start = (page - 1) * resPerPage;
   const end = page * resPerPage;
    //loop through array of recipes to display each
    //create a slice of 10 results to display per page
    recipes.slice(start, end).forEach(renderRecipe);
    //2.render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};