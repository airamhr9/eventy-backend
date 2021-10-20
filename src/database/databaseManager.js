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

    addParticipantToEvent(eventId, userId) {
        get(child(rdbRef,`events/${eventId}/`)).then((snapshot) => {
            let event = snapshot.val() 
            if (event.participants == undefined) {
                event.participants = []
            }
            event.participants.push(userId)
            update(ref(rdb, `events/${eventId}/`), event)
        }        
    )}

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

    async checkName(userName){
        await get(child(rdbRef,`users/${userName}`)).then((snapshot) => {
            if(snapshot.exists()){
                console.log("Name no disponible")
                return Boolean(false)
            }else{
                console.log("Name disponible")
                return Boolean(true)
            }
        })
    }

    async checkMail(userMail){
        await get(child(rdbRef, `users`)).then((snapshot) => {
            if(snapshot.exists){
                let users = []
                users = snapshot.val()
                users.forEach(element => {
                    if(element.email == userMail){
                        console.log("Mail no disponible")
                        return Boolean(false)
                    }
                })
                console.log("Mail disponible")
                return Boolean(true)
            }
        })
    }
}

const dbm = new DatabaseManager

dbm.checkMail("Paco")
dbm.checkName("Srueba")