import { ref, push, get, update, child } from "firebase/database"
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

    addParticipantToEvent(eventId, userId){
        const rdbRef = ref(rdb)
        get(child(rdbRef,`events/${eventId}/participants`)).then((snapshot) => {
            if(snapshot.exists()){ 
                var newParticipants = (snapshot.val()).concat(userId)
                update(ref(rdb, `events/${eventId}`),{
                    participants : newParticipants
                })
                
                return Boolean(true)
            }
            else{ return Boolean(false)} }).catch((error) => {
                console.error(error)
            })
        
    }

}