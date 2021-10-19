import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'
import { getUser, user } from '../users/userProfile.js'

const rdbRef = ref(rdb)
export let event
export let eventParticipants

export async function getEventParticipants(eventId) {
    await getEvent(eventId)
    eventParticipants = []
    for (let userId of event.participants) {
        await getUser(userId)
        eventParticipants.push(user)
    }
}

export async function getEvent(eventId) {
    await get(child(rdbRef, `events/${eventId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            event = snapshot.val()
            if (event.participants == undefined) {
                event.participants = []
            }
        } else {
            event = null
        }
        }).catch((error) => {
            console.error(error)
    });
}

let allEvents

async function getEvents() {
    await get(child(rdbRef, 'events/')).then((snapshot) => {
        if (snapshot.exists()) {
            allEvents = snapshot.val()
        } else {
            allEvents = []
        }
        }).catch((error) => {
            console.error(error)
    });
}

export let userOlderEvents

export async function listUserOlderEvents(userId) {
    await getEvents()
    userOlderEvents = []
    for (let ev of allEvents) {
        let [date, time] = ev.startDate.split(' ')
        let [day, month, year] = date.split('/')
        let [hour, minutes] = time.split(':')
        /*if ((ev.owner == userId || (ev.participants != undefined && ev.participants.includes(userId)))
            && new Date(year, month, day, hour, minutes, 0) < new Date()) {
            userOlderEvents.push(ev)
        }*/ 
        // NO FUNCIONA
    }
}