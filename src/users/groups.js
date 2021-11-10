import { child, get, ref, set } from '@firebase/database'
import { rdb } from '../index.js'
import { getUser, user } from './userProfile.js'
import { replaceImagesWithURL_User, objectWithURLs } from '../images.js'

const rdbRef = ref(rdb)

export function sendUserGroups(userId, res) {
    get(child(rdbRef, 'groups')).then(async (snapshot) => {
        let result = []
        if (snapshot.exists()) {
            let groups = snapshot.val()            
            groups = Object.values(groups)
            for (let g of groups) {
                let groupUsersIds = Object.keys(g.users)
                if (groupUsersIds.includes(userId)) {
                    let objectToSend = {}
                    objectToSend.id = g.id
                    objectToSend.users = []
                    // Añadir nombre y foto a cada usuario para enviar
                    for (let u of Object.values(g.users)) {
                        await getUser(u.userId)
                        await replaceImagesWithURL_User(user)
                        objectToSend.users.push({
                            "id": u.userId,
                            "username": objectWithURLs.username,
                            "image": objectWithURLs.image,
                            "dateMin": u.dateMin,
                            "dateMax": u.dateMax,
                            "price": u.price,
                            "tags": u.tags
                        })
                    }
                    result.push(objectToSend)
                }
            }
        }
        res.send(result)
    }).catch((error) => {
        console.error(error)
    })
}

export function createGroup(userId1, userId2) {
    set(ref(rdb, 'groups'), {
        
    })
}