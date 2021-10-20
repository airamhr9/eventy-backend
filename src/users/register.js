import { ref, set, get, child} from 'firebase/database'
import { rdb } from '../index.js'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth();
const rdbRef = ref(rdb)


export async function register(userName, userPassword, userMail, userBirthDate,res){
        await get(child(rdbRef,`users/${userName}`)).then((snapshot) => {
            if(snapshot.exists()){
                res.send("Nombre de usuario existente")
            }else{
                createUserWithEmailAndPassword(auth, userMail, userPassword).then((userCredential) => {
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
                            res.send("Email existente")
                }) 
            }
        }).catch((error) => {
            console.error(error)
        })

}