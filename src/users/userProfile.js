import { child, get, ref, update } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

export function getUser(res, userId) {
    get(child(rdbRef, `users/${userId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            let user = snapshot.val()
            if(res == null){
                return user
            }
            res.send(user)
        } else {
            res.send('User does not exist')
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