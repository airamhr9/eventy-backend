import { child, DataSnapshot, get, ref } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

function getUserPreferences(userId) {
    get(child(rdbRef, 'users')).then((snapshot) => {
        if (snapshot.exists()) {
            let users = snapshot.val()
            let preferencias = users[userId].tags
            if (preferencias == undefined) {
                preferencias = ["None"]
            }
            send(preferencias)
        } else {
          console.log('No data available')
        }
      }).catch((error) => {
        console.error(error)
      });
}


/*
Endpoint recibe peticion
Llama a acceder a los datos
EN LA PROMESA se responde al cliente
*/

getUserPreferences(0)
getUserPreferences(1)
getUserPreferences(0)

function send(preferencias) {
    console.log(preferencias)
}

