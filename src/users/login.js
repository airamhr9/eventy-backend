import { get, child, ref } from 'firebase/database'
import { rdb } from '../index.js'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const rdbRef = ref(rdb)
const auth = getAuth()

export async function login(userName, password, res) {
    await getUserIdByUsername(userName)
    await get(child(rdbRef, `users/${id}/`)).then((snapshot) => {
        if (snapshot.exists()) {
            let user = snapshot.val()
            if (user.password == password) {
                signInWithEmailAndPassword(auth, user.email, password).then(_ => {
                    res.send(auth.currentUser.uid)
                }).catch(_ => {
                    res.send("Error")
                })
            } else {
                res.send("Error: el usuario o la contraseña introducidos no son correctos")
            }
        } else {
            res.send("Error: el usuario introducido no existe")
        }
    }).catch((error) => {
        console.error(error)
        res.send("Error")
    })
}

let id
async function getUserIdByUsername(username) {
    await get(child(rdbRef, 'users')).then((snapshot) => {
        if (snapshot.exists()) {
            let allUsers = snapshot.val()
            allUsers = Object.entries(allUsers)
            for (let usr of allUsers) {
                if (usr[1].username == username) {
                    id = usr[1].id
                    return
                }
            }
            id = -1
        } else {
            id = -1
        }
    })
}