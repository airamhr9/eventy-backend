export class Event {

    constructor(descripcion, finishDate, id, images, latitude, longitude, maxParticipants, name, owner, price,
        isPrivate,startDate, summary, tags,) {
        this.descripcion = descripcion
        this.finishDate = finishDate
        this.id = id
        this.images = images
        this.latitude = latitude
        this.longitude = longitude
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

    getId() { return this.id }

    getImages(){return this.images}

    getLatitude() { return this.latitude }

    getLongitude() { return this.longitude }

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

    setId(id) { this.id = id }

    setImages(images){this.images = images}

    setLatitude(latitude) { this.latitude = latitude }

    setLongitude(longitude) { this.longitude = longitude }

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