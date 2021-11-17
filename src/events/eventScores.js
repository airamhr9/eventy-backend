import { child, get, ref, set } from '@firebase/database'
import { rdb } from '../index.js'
import { getEvent, event } from './participants.js'

const rdbRef = ref(rdb)

export async function sendUserEventScore(userId, eventId, res) {
    await getEvent(eventId)
    let score = -1
    if (event.scores != undefined) {
        event.scores.forEach(element => {
            if (element.user == userId) {
                score = element.score
            }
        })
    }
    res.send(score)
}

export function addEventScore(userId, eventId, score) {
    let path = `event/${eventId}`
    get(child(rdbRef, path)).then(snapshot => {
        let event = snapshot.val()
        if (event.scores == undefined) {
            event.scores = []
        }
        let data = {
            'user': userId,
            'score': score
        }
        event.scores.push(data)
        event.averageScore = (event.averageScore * (event.scores.length() - 1) + score) / event.scores.length()
        set(ref(rdb, path), event)
    })   
}