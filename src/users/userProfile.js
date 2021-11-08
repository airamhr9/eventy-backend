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
            if (user.friends == undefined) {
                user.friends = []
            }
            if (user.friendshipRequests == undefined) {
                user.friendshipRequests = []
            }
        } else {
            user = 'User does not exist'
        }
        }).catch((error) => {
            console.error(error)
    });
}

export async function getUserByUsername(username) {
    await get(child(rdbRef, 'users')).then((snapshot) => {
        if (snapshot.exists()) {
            let users = snapshot.val()
            users = Object.values(users)
            for (let u of users) {
                if (u.username == username) {
                    user = u
                    if (user.preferences == undefined) {
                        user.preferences = []
                    }
                    if (user.friends == undefined) {
                        user.friends = []
                    }
                    if (user.friendshipRequests == undefined) {
                        user.friendshipRequests = []
                    }
                    return
                }
            }
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
        username: user.username,
        friends : user.friends || [],
        friendshipRequests : user.friendshipRequests || []
    })
}