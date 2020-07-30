import { elements } from "./base";

//function to render items to UI
export const renderItem = item => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
                    <div class="shopping__count">
                        <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                        <p>${item.unit}</p>
                    </div>
                    <p class="shopping__description">${item.ingredient}</p>
                    <button class="shopping__delete btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
                </li>
    `;
    //attach shopping item to the shopping list in the DOM
    elements.shopping.insertAdjacentHTML('beforeend', markup);
}

//function to delete items from UI
export const deleteItem = id => {
    //item to be deleted ties back to data- ID atribute
    const item = document.querySelector(`[data-itemid="${id}"]`);
    //remove the chosen item from the UI
    item.parentElement.removeChild(item);
}