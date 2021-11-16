import { child, get, ref, set, push, update } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

export function filterByGroup(res, idGroup){

    get(child(rdbRef, `groups/${idGroup}/users/`)).then((snapshot) => {

        if(snapshot.exists()){
            let preferences = [] //[user[dateMax, dateMin, price, userId], user2[], ...]
            let users = snapshot.val()

            users.forEach(element => {
                let userPref = [
                    element.dateMax,
                    element.dateMin,
                    element.price,
                    element.userId
                ]
                preferences.push()
            })
        }


    })

}