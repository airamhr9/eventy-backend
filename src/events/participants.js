import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'
import { getUser, user } from '../users/userProfile.js'
import { replaceImagesWithURL_User, objectWithURLs } from '../images.js'

const rdbRef = ref(rdb)

export let event
export let eventParticipants

export async function getEventParticipants(eventId) {
    await getEvent(eventId)
    let confirmedParticipants = []
    let possiblyParticipants = []
    for (let userId of event.participants) {
        await getUser(userId)
        await replaceImagesWithURL_User(user)
        confirmedParticipants.push(objectWithURLs)
    }
    for (let userId of event.possiblyParticipants) {
        await getUser(userId)
        await replaceImagesWithURL_User(user)
        possiblyParticipants.push(objectWithURLs)
    }
    eventParticipants = [confirmedParticipants, possiblyParticipants]
}

export async function getEvent(eventId) {
    await get(child(rdbRef, `events/${eventId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            event = snapshot.val()
            if (event.participants == undefined) {
                event.participants = []
            }
            if (event.possiblyParticipants == undefined) {
                event.possiblyParticipants = []
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
    let now = new Date().toISOString()
    for (let ev of allEvents) {
        if (ev.participants.includes(userId) && ev.finishDate.localeCompare(now) < 0) {
            userOlderEvents.push(ev)
        }
    }
}