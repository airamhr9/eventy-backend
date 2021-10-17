import { child, get, ref } from '@firebase/database'
import { Event } from '../objects/event.js'
import { DatabaseManager } from '../database/databaseManager.js'
import { rdb } from '../index.js'

const dbm = new DatabaseManager
const rdbRef = ref(rdb)

export async function publishEvent(description, finishDate, images, latitude, longitude, maxParticipants, name, owner,
    price, isPrivate, startDate, summary, tags) { 
    await generateEventId()
    const newEvent = new Event(description, finishDate, nextEventId, images, latitude, longitude, maxParticipants,
        name, owner, price, isPrivate, startDate, summary, tags)
    dbm.uploadEvent(newEvent)
}

let nextEventId

async function generateEventId() {
    await get(child(rdbRef, 'events')).then((snapshot) => {
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
