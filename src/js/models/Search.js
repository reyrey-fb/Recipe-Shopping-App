import axios from "axios";

//Search model intakes recipe search query and returns recipe search results

export default class Search {
    //constructor creates search query parameter
    constructor(query){
        this.query = query;
    }
    //method to conduct the recipe search (via API call)
    async getResults() {
    try {
          const res = await axios(
            `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
          ); //returns a promise
          this.result = res.data.recipes;
          //console.log(this.result);
        } catch(error){
            alert(error);
        }
    }
}




