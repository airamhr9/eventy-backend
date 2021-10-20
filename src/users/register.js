import { ref, set} from 'firebase/database'
import { rdb } from '../index.js'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { DatabaseManager } from '../database/databaseManager.js';

const auth = getAuth();
const dbm = new DatabaseManager

export async function register(userName, userPassword, userMail, userBirthDate, res){
    if (await dbm.checkName(userName)){
        if( await dbm.checkMail(userMail)){
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
                res.send(userName)
            }).catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                res.send("Error al contactar con la DB")
            }) 
        }else{ res.send("Error: Email no disponible.")}
    }else{ res.send("Error: Nombre de usuario no disponible.")}
}