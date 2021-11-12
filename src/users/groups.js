import { child, get, ref, set, push, update } from '@firebase/database'
import { rdb } from '../index.js'
import { getUser, user } from './userProfile.js'
import { replaceImagesWithURL_User, objectWithURLs } from '../images.js'
import { getEvent, event } from '../events/participants.js'

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
                            "dateMin": u.dateMin || "",
                            "dateMax": u.dateMax || "",
                            "price": u.price || "",
                            "tags": u.tags || []
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
    let refNewGroup = ref(rdb, 'groups')
    let newGroupId = push(refNewGroup).key

    set(ref(rdb, `groups/${newGroupId}`), {
        id: newGroupId
    })

    set(ref(rdb, `groups/${newGroupId}/users/${userId1}`), {
        userId: userId1
    })

    set(ref(rdb, `groups/${newGroupId}/users/${userId2}`), {
        userId: userId2
    })
}

export function updateGroup(groupId, data) {
    let path = `groups/${groupId}/users/${data.userId}`
    get(child(rdbRef, path)).then((snapshot) => {
            if (snapshot.exists()) {
                update(ref(rdb, path), data)
            } else {
                set(ref(rdb, path), data)
            }
        }).catch((error) => {
            console.error(error)
    });
}

export function addGroupMembersToEvent(groupId, eventId) {
    get(child(rdbRef, `groups/${groupId}/users`)).then(async (snapshot) => {
        let groupUsersIds = Object.keys(snapshot.val())
        await getEvent(eventId)     
        groupUsersIds.forEach(userId => {
            event.participants.push(userId)
        })
        update(ref(rdb, `events/${eventId}`), event)
    })
}