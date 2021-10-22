import { get, ref, set, child, push } from '@firebase/database'
import {rdb} from '../index.js'
import {Message} from '../objects/message.js'



export function communityChat(res, communityId){

    const rdbRef = ref(rdb)

    get(child(rdbRef, `communities/${communityId}/messages/`)).then((snapshot =>{
        let mssgList = snapToArray(snapshot)
        var allMssg = []

        for(var i = 0; i<mssgList.length;i++){
            let aux = new Message(mssgList[i].id, mssgList[i].user, mssgList[i].text, mssgList[i].time, mssgList[i].images)
            allMssg.push(aux)
        }
        sortMssgs(allMssg, res)

    })).catch((error) => {
        console.error(error)
    })

}

function snapToArray(snapshot){
    var returnArr = []

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val()
        item.key = childSnapshot.key

        returnArr.push(item)
    })

    return returnArr
}

export function sendMssgComm(message, communityId, res){

    const refRdb = ref(rdb, `communities/${communityId}/messages/`)
    
    const newRef = push(refRdb)
    const idKey = newRef.key

    set(newRef, {
        id: idKey,
        text: message.text,
        user: message.user,
        time: message.time
    })
    

    res.send(message)
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