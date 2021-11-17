import { child, get, ref, update } from '@firebase/database'
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
    let data = {
        userScore: score,
        averageScore: event.averageScore
    }
    res.send(data)
}

export function addEventScore(userId, eventId, score) {
    let path = `events/${eventId}`
    get(child(rdbRef, path)).then(snapshot => {
        let event = snapshot.val()
        if (event.scores == undefined) {
            event.scores = []
        }
        event.scores = remvoveExistingScore(event.scores, userId)
        let data = {
            'user': userId,
            'score': score
        }
        event.scores.push(data)
        event.averageScore = calculateAverage(event.scores)
        update(ref(rdb, path), event)
    })   
}

function remvoveExistingScore(scores, userId) {
    return scores.filter(element => element.user != userId)
}

function calculateAverage(scores) {
    console.log(scores)
    let average = 0
    scores.forEach(element => average += element.score)
    average /= scores.length
    return average
}