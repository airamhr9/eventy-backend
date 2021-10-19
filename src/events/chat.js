import { get, ref, set, child } from '@firebase/database'
import {rdb} from '../index.js'
import {Message} from '../objects/message.js'



export function eventChat(res, eventId){

    const rdbRef = ref(rdb)

    get(child(rdbRef, `events/${eventId}/messages`)).then((snapshot =>{
        let mssgList = snapshot.val()
        var allMssg = []

        mssgList.forEach(element => {
            var oneMssg = new Message(element.user, element.text, element.time)
            allMssg.push(oneMssg)
        })
        sortMssgs(allMssg, res)

    }))

}

export function sendMssg(userId, text, eventId){
    const refRdb = ref(rdb, `events/${eventId}/messages`)

    let mssg = Message(userId, text, Date.now())

    set(refRdb, mssg)
}

function sortMssgs(mssgs, res){
    try {
        const result = mssgs.sort((a,b) => 
            b.time.localeCompare(a.time)
        )

        const response = {"count":result.length,"messages": result.reverse()}
        res.json(response)
    } catch (error) {
    
    }
}