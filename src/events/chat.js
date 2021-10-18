import { get, ref } from '@firebase/database'
import {rdb} from '../index.js'



export function eventChat(res, eventId){
    const refRdb = ref(rdb, `events/${eventId}/messages`)

    get(child(rdb, `events/${eventId}/messages`)).then((snapshot =>{


    }))

}

export function sendMssg(userId, text, eventId){
    const refRdb = ref(rdb, `events/${eventId}/messages`)

    let mssg = Message(userId, text, Date.now())

    refRdb.set({
        mssg
    })

}