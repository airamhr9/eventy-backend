import { get, ref, set, child, push } from '@firebase/database'
import { objectWithURLs, replaceImagesWithURL_MssgEvent } from '../images.js'
import {rdb} from '../index.js'
import {Message} from '../objects/message.js'



export function eventChat(res, eventId){

    const rdbRef = ref(rdb)

    get(child(rdbRef, `events/${eventId}/messages/`)).then((snapshot =>{
        let mssgList = snapToArray(snapshot)
        var allMssg = []

        for(var i = 0; i<mssgList.length;i++){
            let aux = new Message(mssgList[i].key, mssgList[i].userId, mssgList[i].username, mssgList[i].text, mssgList[i].time, mssgList[i].images)
            allMssg.push(aux)
        }
        sortMssgs(allMssg, eventId, res)

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

export function sendMssg(message, eventId, res){

    const refRdb = ref(rdb, `events/${eventId}/messages/`)
    
    const newRef = push(refRdb)
    const idKey = newRef.key

    set(newRef, {
        id: idKey,
        userId: message.userId,
        text: message.text,
        username: message.username,
        time: message.time,
        images: message.images
    })
    

    res.send(message)
}

async function sortMssgs(mssgs, eventId, res){
    try {
        let fullResult = []
        const result = mssgs.sort((a,b) => 
            b.time.localeCompare(a.time)
        )

        for(var i = 0;i<result.length;i++){
            await replaceImagesWithURL_MssgEvent(result[i], eventId)
            fullResult.push(objectWithURLs)
        }

        const response = {"count":fullResult.length,"messages": fullResult.reverse()}
        res.json(response)
    } catch (error) {
    
    }
}