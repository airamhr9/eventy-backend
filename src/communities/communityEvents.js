import { child, get, ref, update } from '@firebase/database'
import { Event } from '../objects/event.js'
import { DatabaseManager } from '../database/databaseManager.js'
import { rdb } from '../index.js'
import {  replaceImagesWithURL_Event, objectWithURLs } from '../images.js'



const dbm = new DatabaseManager
const rdbRef = ref(rdb)

export async function publishCommEvent(event, commId) {
    await generateEventId()
    event.id = nextEventId
    event.community = commId
    dbm.uploadCommEvent(event, commId)
}

export let nextEventId

export async function generateEventId() {
    await get(child(rdbRef, `events/`)).then((snapshot) => {
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

export function updateCommEvent(eventId, data) {
    update(child(rdbRef, `events/${eventId}`), data)
}

export async function getCommEvents(commId, res){
    await get(child(rdbRef, `events/`)).then((snapshot) => {
        if(snapshot.exists()){
            let events = snapshot.val()
            let result = []

            for(const ev in events){
                if(events[ev].community == commId){
                    result.push(events[ev])
                }
            }

            returnCommEvents(res, result)
        }
        else {
            res.send([])
        }
    })
}

async function returnCommEvents(res, events){
    try {
        let result = []
        for (let ev of events) {
            await replaceImagesWithURL_Event(ev)
            result.push(objectWithURLs)
        }
        res.send(result)
    } catch (error) {
        return "no se pudo enviar"
    }
}