import { child, get, ref, update, push, set } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

export function saveToLater(userId, eventId){
    set(ref(rdb, `users/${userId}/seeItLater/${eventId}` ),{
        event : eventId
    })
}

export function getLaterEvents(userId,res){
    get(child(rdbRef,`users/${userId}/seeItLater`)).then((snapshot) =>
    {
        if(snapshot.exists()){
            let laterEvents = snapshot.val()
            res.send(laterEvents)
        } else {
            res.send([])
        }
    }).catch((error) => {
        console.error(error)
    })
}