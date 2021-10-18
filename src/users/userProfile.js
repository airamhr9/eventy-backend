import { child, get, ref, update } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

export let user

export async function getUser(userId) {
    await get(child(rdbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            user = snapshot.val()
            if (user.preferences == undefined) {
                user.preferences = []
            }
        } else {
            user = 'User does not exist'
        }
        }).catch((error) => {
            console.error(error)
    });
}

export function updateUser(user) {
    update(ref(rdb, `users/${user.id}`), {
        bio: user.bio,
        birthdate: user.birthdate,
        email: user.email,
        id: user.id,
        image: user.image,
        password: user.password,
        preferences: user.preferences,
        username: user.username
    })
}