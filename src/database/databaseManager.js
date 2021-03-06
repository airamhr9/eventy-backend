import { ref, set, get, update, child } from "firebase/database"
import { rdb } from '../index.js'
import { Event } from '../objects/event.js'

const rdbRef = ref(rdb)


export class DatabaseManager {
    
    uploadEvent(event) {
        set(child(rdbRef, `events/${event.id}`), event)
    }

    uploadEventT(eventToUpload, id){
        eventToUpload instanceof Event
        set(ref(rdb,`events/${id}`),{
            description : eventToUpload.getDescription(),
            finishDate : eventToUpload.getFinishDate(),
            id : id,
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
            community : eventToUpload.getCommunity(),
            averageScore : 0
        } )
    }


    async addParticipantToEvent(eventId, userId, confirmed) {
        await get(child(rdbRef,`events/${eventId}/`)).then((snapshot) => {
            let event = snapshot.val()
            if (confirmed) {
                if (event.participants == undefined) {
                    event.participants = []
                }
                event.participants.push(userId)
            } else {
                if (event.possiblyParticipants == undefined) {
                    event.possiblyParticipants = []
                }
                event.possiblyParticipants.push(userId)
            }            
            update(ref(rdb, `events/${eventId}/`), event)
        })
    }

    async getUserPasswordByName(userName){
        var res = "error"
        await get(child(rdbRef, `users/`)).then((snapshot) => {
            if(snapshot.exists()){
                let users = snapshot.val()
                users.forEach(element => {
                    if(element.username.toString() == userName.toString()){
                        res = element.password
                    }
                })
            }
        })
        return res
    }

    snapToArray(snapshot){
        var returnArr = []

        snapshot.forEach(function(childSnapshot) {
            var item = childSnapshot.val()
            item.key = childSnapshot.key
    
            returnArr.push(item)
        })
    
        return returnArr
    }

    uploadCommEvent(event) {
        set(child(rdbRef, `events/${event.id}`), event)
    }
}
