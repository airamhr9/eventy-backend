import { ref, push } from "firebase/database"
import { rdb } from '../index.js'
import { Event } from '../objects/event.js'


export class DatabaseManager {
    uploadEvent(eventToUpload){
        eventToUpload instanceof Event

        push(ref(rdb,'events/'),{
            description : eventToUpload.getDescription(),
            finishDate : eventToUpload.getFinishDate(),
            images : eventToUpload.getImages(),
            location : eventToUpload.getLocation(),
            maxParticipants : eventToUpload.getMaxParticipants(),
            name : eventToUpload.getName(),
            owner : eventToUpload.getOwner(),
            participants: eventToUpload.getParticipants(),
            price : eventToUpload.getPrice(),
            private : eventToUpload.getPrivate(),
            startDate : eventToUpload.getStartDate(),
            summary : eventToUpload.getSummary(),
            tags : eventToUpload.getTags(),
            community : eventToUpload.getCommunity()
        } )
    }
}
