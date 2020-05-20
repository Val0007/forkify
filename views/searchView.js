import {elements} from "./base";


/*
Pasta with tomato spinach
["pasta","with","tomato","spinach"]
 <use href="img/icons.svg#icon-triangle-${type === "prev"?left:right}"></use>
acc:0 /acc+ current.length = 5 newTitle=["pasta"]
acc:5 /acc+ current.length = 9 newTitle=["pasta","with"]
acc:9 /acc+ current.length = 15 newTitle=["pasta,"with","tomato""]
acc:15 /acc+ current.length = 24 newTitle=["pasta","with","tomato"]
*/

//Limiting Title
 const limitRecipeTitle = (title,limit=17) =>{
        const newTitle  =[];
         if(title.length > limit){
            title.split(" ").reduce((acc,current) => {
                if(acc + current.length <= limit){
                    newTitle.push(current);
                }
                return acc+current.length;

            },0); 
            //slice removes an element fr an array
            // returns the result
            return `${newTitle.join(' ')}....`;
         }
        // return title;
}




//--RENDERING EACH RECIPE FUNCTION
const renderRecipe =function(recipe){
    
    const markup = ` 
    <li>
            <a class="results__link " href=#${recipe.recipe_id}> 
                <figure class="results__fig">
                      <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                         <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                        <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
    </li>`;
     elements.searchResList.insertAdjacentHTML("beforeend",markup);

}


//--GETTING INPUT FUNCTION
export const getInput = function(){
    return elements.searchInput.value;
}



//create buuton
//type:previous or next
const createButton = (page,type) =>{
    return `
    <button class="btn-inline results__btn--${type}" data-goto=${type === "prev"?page-1:page+1}>
        <svg class="search__icon">
           
        </svg>
        <span>Page ${type === "prev"?page-1:page+1}</span>
    </button>
     `;

}





//PageButtons
const renderButtons = function(page,numResults,resPerPage){
    const pages  = Math.ceil(numResults/resPerPage);
    let button;
    if(page == 1  && pages>1){
        //Button to go to next page
       button = createButton(page,"next");

    }
    else if(page<pages){
        //Both Buttons
        button = `${createButton(page,"next")}
                  ${createButton(page,"prev")}
        `;

    }
    else if(page == pages && pages>1){ //last page
        //Previous Pages
        button = createButton(page,"prev");
        

    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);

}


//--RENDERING RESULTS FUNCTION
export const renderResults = function(recipes,page=1,resPerPage=10){
    //we get an array of 30 elements from recipe
    const start = (page-1)*resPerPage; //0 ,10,30
    const end = page*resPerPage; //10,20,30

    

    //slice returns a new array
    recipes.slice(start,end).forEach(function(recipe){
        renderRecipe(recipe);
    });


    renderButtons(page,recipes.length,resPerPage);

}




//--CLEARING INPUT FUNCTION
export const clearInput = function(){
    elements.searchInput.value = "";

}



//Clearing Display
export const clearDisplayList = function(){
    elements.searchResList.innerHTML ="";
    elements.searchResPages.innerHTML="";

}

export const highlightedSelected = (id)=>{
    document.getElementById(`a[href="#${id}"]`).classList.add("result__link--active");
}
