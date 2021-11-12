import { child, get, ref, set } from '@firebase/database'
import { rdb } from '../index.js'
import { getUser, user } from './userProfile.js'

const rdbRef = ref(rdb)

export async function sendEventMarks(userId, res) {
    await getUser(userId)
    if (user.eventMarks == undefined) {
        res.send([])
    } else {
        res.send(user.eventMarks)
    }
}

export function addEventMark(userId, eventId, mark) {
    let path = `users/${userId}/eventMarks`
    get(child(rdbRef, path)).then(snapshot => {
        let marks = snapshot.val()
        if (marks == undefined) {
            marks = []
        }
        let data = {
            'event': eventId,
            'mark': mark
        }
        marks.push(data)
        set(ref(rdb, path), marks)
    })   
}