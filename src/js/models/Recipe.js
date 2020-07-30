import axios from 'axios';

export default class Recipe {
  //constructor creates recipe ID parameter
  constructor(id) {
    this.id = id;
  }
  //method to get the Recipe by user-selected ID (via API call)
  async getRecipe() {
    try {
          const res = await axios(
            `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
          );
          //assigns specific data property of the recipe result to class variable
          this.title = res.data.recipe.title;
          this.author = res.data.recipe.publisher;
          this.img = res.data.recipe.image_url;
          this.url = res.data.recipe.source_url;
          this.ingredients = res.data.recipe.ingredients;
          
        } catch(error) {
        console.log(error);
        alert('Something went wrong!');
    }

  }
  //method to roughly calculate cooking time
  calcTime() {
    //assume that every 3 ingredients means 15 minutes of cooking time
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }
  //method to identify number of servings in recipe
  calcServings() {
    this.servings = 4;
  }
  //method to parse quantity, unit, description elements of the ingredients array
  parseIngredients() {
    //arrays of ingredients as they appear (unitsLong) and as we want them to be (unitsShort)
    //index of array elements in unitsLong and unitsShort correspond
    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitsShort, 'kg', 'g']; //adding edge units to the list

    //create new array with parsed ingredients
    const newIngredients = this.ingredients.map(el => {
      //1. Uniform units
      let ingredient = el.toLowerCase();
      //replace element (unit) at position i in unitsLong with the element in the same position in unitsShort
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      //2. Remove parenthesis
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); //regular expression
      //3. Parse ingredients into count, unit and ingredient itself
        //split the words in an ingredient into an array
        const arrIng = ingredient.split(' ');
        //find index of where the unit is located, after testing which word in the array is a unit (includes returns true/false)
        const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

        let objIng;
        if(unitIndex > -1){
          //if there is a unit 
          //assume everything before the unit is the count, and slice it off
          //ex. 4 1/2 cups, arrCount = [4, 1/2] 
          const arrCount = arrIng.slice(0, unitIndex); 

          let count;
          if(arrCount === 1) {
            //ex. 4-1/2 --> eval "4+1/2" --> 4.5
            count = eval(arrIng[0].replace('-', '+'));
          } else {
            //ex. 4 1/2 cups, arrCount = [4, 1/2] --> eval "4 + 1/2" --> 4.5
            count = eval(arrIng.slice(0, unitIndex).join('+'));
          }

          objIng = {
            count, 
            unit: arrIng[unitIndex],
            ingredient: arrIng.slice(unitIndex + 1).join(' ')
          }

        } else if(parseInt(arrIng[0], 10)){
          //else if there is no unit but the 1st element is a number
          objIng = {
            count: parseInt(arrIng[0], 10),
            unit: '',
            ingredient: arrIng.slice(1).join(' ') //the ingredient is every word in the array after the index 0 integer, slice that and join it into a string again
          };
        }
        else if(unitIndex === -1) {
          //else if there is no unit and no number in first position
          objIng = {
            count: 1, //count set to 1 when ingredient has no quantity
            unit: '',
            ingredient //reads same as ingredient:ingredient
          }
        }
      return objIng;
    });
    this.ingredients = newIngredients;
  }

  //method to update servings and ingredient counts based on UI inputs
  updateServings (type) { //type is decrease or increase (servings)
    //update servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;
    //update ingredient counts based on changed servings
    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}