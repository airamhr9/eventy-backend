export class Post {
    constructor(id, title, text, date, author) {
        this.id = id
        this.title = title 
        this.text = text
        this.date = date
        this.author = author
        this.numComments = 0
        this.images = []
    }

    addImage(image){
        this.images.push(image)
    }
}