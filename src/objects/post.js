export class Post {
    constructor(id, title, text, date, author, location) {
        this.id = id
        this.title = title 
        this.text = text
        this.date = date
        this.author = author
        this.location = location
        this.numComments = 0
        this.likes = 0
        this.dislikes = 0
        this.images = []
    }

    addImage(image){
        this.images.push(image)
    }
    addLike(){
        this.likes ++
    }
    addDislike(){
        this.dislikes ++
    }
}