import { get, child, ref } from 'firebase/database'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { rdb } from '../index.js'

const auth = getAuth();
const rdbRef = ref(rdb)

// console.log(login("prueba", "1234567"))

export async function login(userName, password){ 
    var email = ""

    await get(child(rdbRef, `users/`)).then((snapshot) => {
        if(snapshot.exists()){
            let users = snapshot.val()
            users.forEach(element => {
                if(element.username.toString() == userName.toString()){
                    email = element.email
                }
            })
        }
    })
    if(email != ""){
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            return "true"
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            return "error"
        })
    }
    return email
}

