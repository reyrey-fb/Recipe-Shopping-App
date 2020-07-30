export default class Likes {
    constructor() {
        //empty array containing likes list, items pushed here when added to list
        this.likes = [];
    }

    //method to allow user to add a liked item, pushing it to the likes array
    //parameters are the information we want displayed per item in the likes list
    addLike(id, title, author, img) {
            //create new like object
            const like = {id, title, author, img};
            //push new like object to likes array
            this.likes.push(like);
            //persist data in localStorage
            this.persistData();
            //return new added item
            return like;
        }
    //method to allow user to delete a liked item, removing it from likes array
    deleteLike(id) {
            //find index of item user wants to delete
            //if the element's ID is equal to the ID of the Item, return its index
            const index = this.likes.findIndex(el => el.id === id);
            //remove the deleted item at index from items array
            this.likes.splice(index, 1);
            //persist data in localStorage
            this.persistData();
        }
    
    //method that asks if an item has been liked
    isLiked(id) {
        //return true if item id exists in the likes array (i.e. it's been liked)
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    //method to get the number of liked items
    getNumLikes() {
        return this.likes.length;
    }

    //method to store/set local likes data
    persistData() {
        //save the likes array and convert it to a string
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    //method to read/get local likes data
    readStorage() {
        //read the likes array and convert it back to an array
        const storage = JSON.parse(localStorage.getItem('likes'));
        //if there is any likes data stored, reset likes array to what is in storage
        if(storage) this.likes = storage;
    }
}


