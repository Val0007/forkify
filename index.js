// const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from './models/List';
import Like from './models/Likes'
import {elements,renderLoader,clearLoader} from "./views/base";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from './views/listView';
import Likes from "./models/Likes";

//Global state of the app
// --Search object
// --current recipe object
// --shopping list
// --Liked recipes
const state ={};



//-SEARCH CONTROLLER
const controlSearch = async function(){

    //--get a query
    const query = searchView.getInput();

    if(query){
        //new search and add to state
        state.search = new Search(query);
        

        //--2.Prepare UI
        searchView.clearInput();
        searchView.clearDisplayList();
        renderLoader(elements.searchRes);
        

        try{
            
        //--3.Search recipes
        await state.search.getResults(); //async returns a promise we need to wait
        
        
        
        
        //--4.Render Results on UI
        
        clearLoader();
        searchView.renderResults(state.search.result);
        

        }
        catch(e){
            clearLoader();
            alert("Some ERROR OCCURED");

        }
        


    }
}


//--Submit The Query
elements.searchForm.addEventListener('submit',e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click',function(e){
   const btn = e.target.closest('.btn-inline');
    console.log(btn);
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10); //base 10
        console.log(goToPage);
        searchView.clearDisplayList();
        searchView.renderResults(state.search.result,goToPage); //override page 1
    }
});




//--RECIPE CONTROLLER

// const r = new Recipe(47746);
// console.log(r.getRecipe());

const controlRecipe = async ()=>{
    //when you click on a new link the window hash changes
    //==GET ID
    const id = window.location.hash.replace("#","");  //#456985
    
    if(id){

        //--PREPARE UI
        // if(state.search){
        //     searchView.highlightedSelected(id);
        
        // }
        recipeView.clearRecipe();
        state.recipe= new Recipe(id);
       
        
        try{
            

            //CALCULATE SERVINGS
            renderLoader(elements.recipe);
            await state.recipe.getRecipe();
            state.recipe.parseIngredient();
            state.recipe.calcTime();
            state.recipe.calcServings();
           
            
    
            
            //--GET RECIPE DATA
            clearLoader();

            recipeView.renderRecipe(state.recipe);
    
        }
        catch(e){
            console.log(e);
            alert("Problem with the Recipe! :(");
        }



    }
}

//CALLING THE FUNCTION
['hashchange','load'].forEach(event => {
    window.addEventListener(event,controlRecipe);
});


//--LIST CONTROLLER
const controlList = ()=>{
    //create new list if none
    if(!state.list){
        state.list = new List();
    }
    else{
        state.recipe.ingredients.forEach(el => {
          const item =   state.list.addItem(el.count,el.unit,el.ingredient);
          listView.renderItem(item);
        });
    }


}
//LIKES OBJECT
const controlLike = () => {
    if(!state.like){
        state.like = new Likes();
        const currentId = state.recipe.id;
    }

    if(!state.like.isLiked(currentId)){
        const newLike = state.like.addLike(
            currentId,state.recipe.title,state.recipe.author,state.recipe.img
        );
    }
    else{
        state.likes.deleteLike(currentId);

    }
}


//--DELETE AND UPDATE LIST EVENTS
elements.shopping.addEventListener('click',function(e){
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //HANDLE DELETE
    if(e.target.matches('.shopping__delete,.shopping__delete *')){

        state.list.deleteItem(id);
        listView.deleteItem(id);
        
    }
    else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value);
        state.list.updateCount(id,val);
    }
})







//RECIPE BUTTON CLICKS
elements.recipe.addEventListener('click',function(e){
    if(e.target.matches('.btn-decrease,.btn-decrease *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings("dec");
            recipeView.updateServingsIngredients(state.recipe);
        }
        
    }
    if(e.target.matches('.btn-increase,.btn-increase *')){
        state.recipe.updateServings("inc");
        
        recipeView.updateServingsIngredients(state.recipe);
        

    }
    //ADD TO SHOPPING LIST
    else if(e.target.matches('.recipe-btn--add,.recipe-btn--add *')){
        controlList();
    }//--LIKES EVENT
    else if(e.target.matches('.recipe__love,.recipe__love *')){
        controlLike();
    }


    


});





