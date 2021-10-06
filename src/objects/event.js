export class Event {
    construtor(id, name, startDate, finishDate, location, description, summary, isPrivate, images, maxParticipants, price, owner, chat, tags){
        this.id = id
        this.name = name
        this.startDate = startDate
        this.finishDate = finishDate
        this.location = location
        this.description = description
        this.summary = summary
        this.isPrivate = isPrivate
        this.images = images
        this.maxParticipants = maxParticipants
        this.price = price
        this.owner = owner
        this.chat = chat
        this.tags = tags
        this.participants = []
        this.community = ""
    }

    addTags(tags) {
        this.tags.concat(tags)
    } 

    addParticipants( participants ) {
        this.participants.concat(participants)
    } 

    setCommunity(community) {
        this.community = community
    } 

}