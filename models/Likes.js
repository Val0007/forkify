export default class Likes{
    constructor() {
        this.likes =[];
    }
    addLike(id,title,author,img){
        const like={
            id,
            title,
            author,
            img
        }
        this.likes.push(like);
        return like;
    }
    deleteItem(id){
        const index = this.likes.findIndex(el => el.id===id);
        //[2,4,8].splice(1,1)  =>returns 4 and arr becomes [2,8]
        //[2,4,8].slice(1,1)  =>returns 4 and arr becomes [2,4,8]
        this.items.splice(index,1) //start and end 
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1; //return true or false
    }

    getNumLikes(){
        return this.likes.length;
    }
}