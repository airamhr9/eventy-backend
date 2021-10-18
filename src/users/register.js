import { ref, set} from 'firebase/database'
import { rdb } from '../index.js'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth();

register("prueba", "1234567", "prueba@prueba.com", "12/01/2000")

export async function register(userName, userPassword, userMail, userBirthDate){
    await createUserWithEmailAndPassword(auth, userMail, userPassword).then((userCredential) => {
        set(ref(rdb,`users/${userName}`),{
            bio : "",
            birthdate : userBirthDate,
            email : userMail,
            id : userCredential.user.uid,
            image : "",
            password : userPassword,
            preferences : [],
            username : userName
        })
        return userName
    }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        return "error"
    })
    return "false"
}
