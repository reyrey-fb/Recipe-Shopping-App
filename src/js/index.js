import Search from './models/Search';
import Recipe from './models/Recipe';
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from './views/searchView';
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global State of the App, includes
 * search object
 * current recipe object
 * shopping list object
 * liked recipes
 */
const state = {};

/**** SEARCH CONTROLLER ****/

const controlSearch = async () => {
  //1. get search query from View module (user input)
  const query = searchView.getInput();

  if(query) {
    //2. create new search object and add it to current state variable
    state.search = new Search(query);
    //3. prepare UI for what's going to happen
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    try{
         //4. search for recipes
         await state.search.getResults();
         //getResults is an async function so it returns a promise therefore you have to use await to await the promise and make this whole function async

         //5. render results on the UI
         clearLoader();
         searchView.renderResults(state.search.result);
       } catch(err){
         alert('Error fetching results');
         clearLoader();
       }

  }
}

//event listener for the search bar element
elements.searchForm.addEventListener('submit', e => {
  e.preventDefault(); //prevents page reload anytime search element is clicked
  controlSearch();
});

//event listener for pagination buttons not yet visible on load
elements.searchResPages.addEventListener('click', e => { //e is the event
  //identifies the button parent element as the target when clicked
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    //reads html data attribute to ID what page to go to next
    const goToPage = parseInt(btn.dataset.goto, 10);
    //clears results and buttons from previous page each time next page is clicked
    searchView.clearResults();
    //displays recipe results based on which page its on
    searchView.renderResults(state.search.result, goToPage);
  }
})

/**** RECIPE CONTROLLER ****/

const controlRecipe= async () => {
  //get recipe ID from item URL hash
  const id = window.location.hash.replace('#', ''); 

  if(id){ //to prevent recipe display if URL has no hash in it
    //prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //highlight selected search item
    if(state.search) searchView.highlightSelected(id);

    //create new recipe object
    state.recipe = new Recipe(id);

    try{
      //get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      //call functions to calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      //render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch(err){
        alert('Error processing recipe.');
    }
  }
}

/**** SHOPPING LIST CONTROLLER ****/

//add new items to the shopping list
const controlList = () => {
  //create a new list if there is no list yet 
  if (!state.list) state.list = new List();

  //add each ingredient in the current recipe to the list and display to UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  })
}

//handle delete and update list item events
  elements.shopping.addEventListener('click', e => {
    //get item ID of shopping list item closest to the buttons clicked
    const id = e.target.closest(".shopping__item").dataset.itemid;
    //handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
      //delete from the app state
      state.list.deleteItem(id);
      //delete from the UI
      listView.deleteItem(id);

    //handle the count update
    } else if (e.target.matches('.shopping__count-value')){
      //read the current count value of the item that was clicked
      const val = parseFloat(e.target.value, 10);
      //update the count
      state.list.updateCount(id, val);
    }
  });

/**** LIKE CONTROLLER ****/

//creates likes list and add new items to the likes list
const controlLike = () => {
  //create a new Likes instance if there is no Likes list yet 
  if(!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  //if the recipe item has not yet been liked (heart button unclicked)
  if(!state.likes.isLiked(currentID)) {
    //add like to the recipe state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle the like button (make the heart button full)
    likesView.toggleLikeBtn(true);

    //Add like to the UI list of liked items
    likesView.renderLike(newLike);

  //else the recipe item has been liked (heart button clicked)
  } else {
    //remove like from the recipe state
    state.likes.deleteLike(currentID);

    //Toggle the like button (make the heart button empty)
    likesView.toggleLikeBtn(false);

    //Remove like from the UI list of liked items
    likesView.deleteLike(currentID);
  }
  //call function to hide or show likes menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore liked recipes on page load
window.addEventListener('load', () => {
  //on page load, create a new likes state object
  state.likes = new Likes();
  //now fill that otherwise empty likes object with the local storage data
  state.likes.readStorage();
  //toggle like menu button to show if likes array has items in it (not null)
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  //render the existing likes in the UI
  state.likes.likes.forEach(like => likesView.renderLike(like));
});


/**** EVENT LISTENERS ****/

//event listener for recipe URL hash changes & page loads (so recipe displays when hash doesn't change)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//event handlers for any button clicked on the recipe object
elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    //reads if target matches btn-decrease or any child of btn-decrease class
    //Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    //add to shopping list if button is clicked
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    //add to likes list if button is clicked
    controlLike();
  }    
});






