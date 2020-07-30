import { elements } from "./base";
import { limitRecipeTitle } from './searchView';

//toggle recipe heart button icons when liked and not liked
export const toggleLikeBtn = isLiked => {
    //icon svg link when not liked: img/icons.svg#icon-heart-outlined
    //icon svg link when liked: img/icons.svg#icon-heart
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector(".recipe__love use").setAttribute("href", `img/icons.svg#${iconString}`);
}

//toggle page heart button when likes list exists or doesn't
export const toggleLikeMenu = numLikes => {
    //toggle css visibility property (show or hide button element)
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
}

//display the liked items on the UI
export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

//delete the liked items that are unliked from the UI
export const deleteLike = id => {
    //select li parent container that contains the likes link class and id of the deleted item
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if(el) el.parentElement.removeChild(el);
}
