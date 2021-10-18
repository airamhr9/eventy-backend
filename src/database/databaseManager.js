import { ref, set, get, update, child } from "firebase/database"
import { rdb } from '../index.js'
import { Event } from '../objects/event.js'

const rdbRef = ref(rdb)


export class DatabaseManager {
    uploadEvent(eventToUpload){
        eventToUpload instanceof Event

        set(ref(rdb,`events/${eventToUpload.getId()}`),{
            description : eventToUpload.getDescription(),
            finishDate : eventToUpload.getFinishDate(),
            id : eventToUpload.getId(),
            images : eventToUpload.getImages(),
            latitude : eventToUpload.getLatitude(),
            longitude : eventToUpload.getLongitude(),
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