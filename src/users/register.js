import { ref, set, get, child} from 'firebase/database'
import { rdb } from '../index.js'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth();
const rdbRef = ref(rdb)

let existsUsername
async function searchUserByUsername(username) {
    await get(child(rdbRef, 'users')).then((snapshot) => {
        if (snapshot.exists()) {
            let allUsers = snapshot.val()
            allUsers = Object.entries(allUsers)
            for (let usr of allUsers) {
                if (usr[1].username == username) {
                    existsUsername = true
                    return
                }
            }
            existsUsername = false
        } else {
            existsUsername = false
        }
    })
}

export async function register(userName, userPassword, userMail, userBirthDate,res) {
    await searchUserByUsername(userName)
    if (existsUsername) {
        res.send("Nombre de usuario existente")
    } else {
        createUserWithEmailAndPassword(auth, userMail, userPassword).then((userCredential) => {
            set(ref(rdb,`users/${userCredential.user.uid}`),{
                bio : "",
                birthdate : userBirthDate,
                email : userMail,
                id : userCredential.user.uid,
                image : "userImg.jpg",
                password : userPassword,
                preferences : [],
                username : userName
                })
                res.send(userName)
        }).catch((error) => {
            res.send("Email existente")
        })
    }
}