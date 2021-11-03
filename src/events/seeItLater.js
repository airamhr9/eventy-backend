import { child, get, ref, set } from '@firebase/database'
import { rdb } from '../index.js'
import { replaceImagesWithURL_Event, objectWithURLs } from '../images.js'

const rdbRef = ref(rdb)
const eventsId = []
const events = []

export function saveToLater(userId, eventId){
    set(ref(rdb, `users/${userId}/seeItLater/${eventId}` ),{
        event : eventId
    })
}

export async function getLaterEvents(userId, res){
    await get(child(rdbRef,`users/${userId}/seeItLater`)).then((snapshot) =>
    {
        if(snapshot.exists()){
            snapshot.forEach( childSnapshot => 
                {   var item = ""
                    item =  childSnapshot.key
                    eventsId.push(item)
                })  
                getDataOfEvents(res)
        } else {
            res.send([])
        }
    }).catch((error) => {
        console.error(error)
    })
}

async function getDataOfEvents(res) {
    for (const id of eventsId) {
        await get(child(rdbRef, `events/${id}`)).then( async (snapshot) => {
            let event = snapshot.val()
            await replaceImagesWithURL_Event(event)
            events.push(objectWithURLs)
        }).catch((error) => { console.error(error) })
    }
    res.send(events)
}
