import { child, get, ref, update } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

export function getUserPreferences(res, userId) {
    get(child(rdbRef, `users/${userId}/preferences`)).then((snapshot) => {
        if (snapshot.exists()) {
            let preferences = snapshot.val()
            if(res == null){
                return preferences
            }
            res.send(preferences)
        } else {
            res.send([])
        }
        }).catch((error) => {
            console.error(error)
    });
}

export function setUserPreferences(userId, preferences) {
    update(ref(rdb, `users/${userId}`), {
        preferences: preferences
    })
}