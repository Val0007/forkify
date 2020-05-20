import axios from "axios";




export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        try{
            const res= await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            console.log(res);
            this.title= res.data.recipe.title;
            this.author= res.data.recipe.publisher;
            this.img=res.data.recipe.image_url;
            this.url=res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        }
        catch(e){
            alert("Something went Wrong! :(");
            console.log(e);
        }
    }
    calcTime(){
        //we guess that 3 ingredients take 15min to cook
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time= periods*15;
    }
    calcServings(){
        this.servings = 4;
    }
    parseIngredient(){
        const unitsLong = ["tablespoons","tablespoon",'ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitShort,'kg','g'];
        const newIngredients = this.ingredients.map(el => {
            //--1.Unform units
            let ingredient= el.toLowerCase();
            unitsLong.forEach((unit,i) => {
                ingredient = ingredient.replace(unit,units[i]);
            });

            //--2.Remove Paratheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");//give space instead of parenthesis


            //--3.Parse ing into count,unit,and ing
            const arrIng = ingredient.split(" ");
            const unitIndex = arrIng.findIndex(el2 => {
                unitShort.includes(el2); //most likely to return 0,1,2
            });


          
            //unit is tsp or cups etc , count is no of tsp or cups etc;
            let objIng;
            if(unitIndex > -1){
                //--[4,1/2]
                //EX. 4,1/2 ,arrCount = [4,1/2]
                //EX.4 cups,arrCount = [4]
                const arrCount  = arrIng.slice(0,unitIndex);//unitIndex will not be included
                let count ;
                if(arrCount.length ===1){
                    count = eval(arrIng[0].replace("-","+")); //due to some api errors
                }
                else{
                    count = eval(arrIng.slice(0,unitIndex).join("+")); //4+1/2 = 4.5
                }
                objIng = {
                    count:count,
                    unit:arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex+1).join(" ")
                };


            }
            else if(unitIndex===-1){
                //there is no unit and no number
                objIng = {
                    count:1,
                    unit:"",
                    ingredient:ingredient
                }

            }
            else if(parseInt(arrIng[0],10)){
                //there is no unit but first el is a number
                objIng = {
                    count:parseInt(arrIng[0],10),
                    unit:"",
                    ingredient:arrIng.splice(1).join(" ") //{count:4,unit:"",ingridient:feta cheese,corn flour}
                }
               
            }


            return objIng;

        });
        this.ingredients= newIngredients;
     
    }
    updateServings(type){
        const newServings = type==='dec'?this.servings-1:this.servings+1;

        this.ingredients.forEach(ing=>{
            ing.count = ing.count *(newServings/this.servings);
        });

        this.servings  = newServings;
    }



} 
