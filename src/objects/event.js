export class Event {

    constructor(descripcion, finishDate, images, location, maxParticipants, name, owner, price, isPrivate, startDate, summary, tags, ){
        this.descripcion = descripcion
        this.finishDate = finishDate
        this.images = images
        this.location = location
        this.maxParticipants = maxParticipants
        this.name = name
        this.owner = owner
        this.participants = []
        this.price = price
        this.isPrivate = isPrivate
        this.startDate = startDate
        this.summary = summary
        this.tags = tags
        this.community = [] 
    }
    
    addTags(tags) {this.tags.concat(tags)} 

    addParticipants( newParticipant ) {this.participants.concat(newParticipant)} 

    //Getters

    getDescription(){return this.descripcion}

    getFinishDate(){return this.finishDate}

    getImages(){return this.images}

    getLocation(){return this.location}

    getMaxParticipants(){return this.maxParticipants}

    getName(){return this.name}

    getOwner(){return this.owner}

    getParticipants(){return this.participants}

    getPrice(){return this.price}

    getPrivate(){return this.isPrivate}

    getStartDate(){return this.startDate}

    getSummary(){return this.summary}

    getTags(){return this.tags}

    getCommunity(){return this.community}


    //Setters
    
    setDescription(descripcion){this.descripcion = descripcion}

    setFinishDate(finishDate){this.finishDate = finishDate}

    setImages(images){this.images = images}

    setLocation(location){this.location = location}

    setMaxParticipants(maxParticipants){this.maxParticipants = maxParticipants}

    setName(name){this.name = name}

    setOwner(owner){this.owner = owner}

    setParticipants(participants){this.participants = participants}

    setPrice(price){this.price = price}

    setPrivate(isPrivate){this.isPrivate = isPrivate}

    setStartDate(startDate){this.startDate = startDate}

    setSummary(summary){this.summary = summary}

    setTags(tags){this.tags = tags}

    setCommunity(community) {this.community = community} 

}