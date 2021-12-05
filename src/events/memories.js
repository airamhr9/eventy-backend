import { child, get, ref, set, push } from '@firebase/database'
import { sendMemoriesWithImages } from '../images.js'
import { rdb } from '../index.js'

const rdbRef  = ref(rdb)

export function createMemory(eventId, text, author, images, res) {
    const rdbRefC = ref(rdb,`events/${eventId}/memories/`)
    const newRef = push(rdbRefC)
    const idKey = newRef.key
    set(newRef,
    {   
        id : idKey,
        text : text,
        date : new Date().toISOString(),
        author : author, 
        images : images

    }).catch((error) => {
        console.error(error)
    })
    res.send(idKey)
}

export function getMemories(eventId, res) {
    get(child(rdbRef,`events/${eventId}/memories/`)).then((snapshot) => {
        if (snapshot.exists()) {
            const memories = Object.values(snapshot.val())
            sendMemoriesWithImages(memories, res)
        } else {
            res.send([])
        }
    }).catch((error) =>{
        console.error(error)
    })
}
