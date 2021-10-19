import { get, child, ref } from 'firebase/database'
import { rdb } from '../index.js'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'



const rdbRef = ref(rdb)
const auth = getAuth();

export async function login(userName, password){
    await get(child(rdbRef,`users/${userName}/`)).then((snapshot) => {
        if(snapshot.exists()){
            let user = snapshot.val()
            if(user.password == password){
                signInWithEmailAndPassword(auth,user.email,password).then(_ => {
                    return auth.currentUser.uid
                  }).catch( _  => {
                      return "error"
                  })
            }
        }
    }).catch((error) => {
        console.error(error)
        return "error"
    })
}