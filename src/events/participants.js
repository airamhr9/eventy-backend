import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'
import { getUser, user } from '../users/userProfile.js'

const rdbRef = ref(rdb)
export let event
export let eventParticipants

export async function getEventParticipants(eventId) {
    await getEvent(eventId)
    eventParticipants = []
    await getUser(event.owner)
    eventParticipants.push(user)
    for (let userId in event.participants) {
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