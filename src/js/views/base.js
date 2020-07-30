//central object containing all DOM selectors
export const elements = {
         searchForm: document.querySelector(".search"),
         searchInput: document.querySelector(".search__field"),
         searchRes: document.querySelector(".results"),
         searchResList: document.querySelector(".results__list"),
         searchResPages: document.querySelector(".results__pages"),
         recipe: document.querySelector(".recipe"),
         shopping: document.querySelector(".shopping__list"),
         likesMenu: document.querySelector(".likes__field"),
         likesList: document.querySelector(".likes__list")
       };

//DOM selector strings as variables (prevent hard-coding of DOM elements)
export const elementStrings = {
    loader: 'loader'
};

//"thinking" spinner loader while you wait for AJAX call
//pass through parent element to attach loader to different HTML parent elements
export const renderLoader = parent => {
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    //add the loader html inside the parent element
    parent.insertAdjacentHTML('afterbegin', loader);
};

//clear or delete the loader element when API results are ready
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader){
        //to remove a DOM element, move up to parent first and remove the child
        loader.parentElement.removeChild(loader);
    }
};