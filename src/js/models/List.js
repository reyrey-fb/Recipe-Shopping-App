import uniqid from 'uniqid';

export default class List {
    constructor() {
        //empty array containing shopping list, items pushed here when added to list
        this.items = [];
    }

    //method to add ingredients (with their count and unit) to shopping list
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(), //unique ID created for each item
            count, 
            unit,
            ingredient 
        }
        //push new item to the array
        this.items.push(item);
        return item;
    }

    //method to allow user to delete a shopping list item, removing it from items array
    deleteItem(id) {
        //find index of item user wants to delete
        //if the element's ID is equal to the ID of the deleted Item, return its index
        const index = this.items.findIndex(el => el.id === id);
        // [2,4,8] splice(1,2) -> returns [4,8] and mutates array to [2]
        // [2,4,8] slice(1,2) -> returns 4 and array not mutated [2,4,8]
        //remove the deleted item at index from items array
        this.items.splice(index, 1);
    }

    //method to allow user to manually update the ingredient count in shopping list
    updateCount(id, newCount) {
        //find item that user wants to modify and update its count per user input
        this.items.find(el => el.id === id).count = newCount;
    }
}