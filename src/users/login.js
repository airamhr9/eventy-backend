import { get, child, ref } from 'firebase/database'
import { rdb } from '../index.js'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const rdbRef = ref(rdb)
const auth = getAuth()

export async function login(userName, password, res) {
    await get(child(rdbRef, `users/${userName}/`)).then((snapshot) => {
        if (snapshot.exists()) {
            let user = snapshot.val()
            if (user.password == password) {
                signInWithEmailAndPassword(auth, user.email, password).then(_ => {
                    res.send(auth.currentUser.uid)
                }).catch(_ => {
                    res.send("error")
                })
            } else {
                res.send("error")
            }
        } else {
            res.send("error")
        }
    }).catch((error) => {
        console.error(error)
        res.send("error")
    })
}