import { child, get, ref, update } from '@firebase/database'
import { Event } from '../objects/event.js'
import { DatabaseManager } from '../database/databaseManager.js'
import { rdb } from '../index.js'
import {  replaceImagesWithURL_Event } from '../images.js'


const dbm = new DatabaseManager
const rdbRef = ref(rdb)

export async function publishCommEvent(event, commId) {
    await generateEventId(commId)
    event.id = nextEventId
    dbm.uploadCommEvent(event, commId)
}

export let nextEventId

export async function generateEventId(id) {
    await get(child(rdbRef, `communities/${id}/events`)).then((snapshot) => {
        if (snapshot.exists()) {
            let events = snapshot.val()
            nextEventId = events[events.length - 1].id + 1
        } else {
            nextEventId = 0
        }
        }).catch((error) => {
            console.error(error)
    });
}

export function updateCommEvent(commId, eventId, data) {
    update(child(rdbRef, `communities/${commId}/events/${eventId}`), data)
}

export async function getCommEvents(commId){
    await get(child(rdbRef, `communities/${commId}/events/`)).then((snapshot) => {
        if(snapshot.exists()){
            let events = snapshot.val()
            let aux = []
            for (let ev of events) {
                replaceImagesWithURL_Event(ev)
                aux.push(objectWithURLs)
            }
            return aux
        }
    })
}