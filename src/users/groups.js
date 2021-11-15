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
                if (g.unconfirmedUsers == undefined) {
                    g.unconfirmedUsers = []
                }
                let groupUsersIds = Object.keys(g.users)
                if (groupUsersIds.includes(userId)) {
                    let objectToSend = {}
                    objectToSend.id = g.id
                    objectToSend.creator = g.creator
                    objectToSend.users = []
                    objectToSend.unconfirmedUsers = []
                    // Añadir nombre y foto a cada usuario para enviar
                    for (let u of Object.values(g.users)) {
                        await getUser(u.userId)
                        await replaceImagesWithURL_User(user)
                        objectToSend.users.push({
                            "id": u.userId,
                            "username": objectWithURLs.username,
                            "image": objectWithURLs.image,
                            "validPreferences": u.validPreferences,
                            "dateMin": u.dateMin || "",
                            "dateMax": u.dateMax || "",
                            "price": u.price || "",
                            "tags": u.tags || []
                        })
                    }
                    for (let uid of g.unconfirmedUsers) {
                        await getUser(uid)
                        await replaceImagesWithURL_User(user)
                        objectToSend.unconfirmedUsers.push({
                            "id": uid,
                            "username": objectWithURLs.username,
                            "image": objectWithURLs.image
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

export function sendUserGroupRequests(userId, res) {
    get(child(rdbRef, `users/${userId}`)).then((snapshot) => {
        let user = snapshot.val()
        if (user.groupRequests == undefined) {
            user.groupRequests = []
        }
        res.send(user.groupRequests)
    })
}

export function createGroup(creatorId) {
    let refNewGroup = ref(rdb, 'groups')
    let newGroupId = push(refNewGroup).key

    set(ref(rdb, `groups/${newGroupId}`), {
        id: newGroupId,
        creator: creatorId
    })
    set(ref(rdb, `groups/${newGroupId}/users/${creatorId}`), {
        userId: creatorId,
        validPreferences: false
    })

    return newGroupId
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

export function addGroupRequestToUser(groupId, userId) {
    get(child(rdbRef, `users/${userId}`)).then((snapshot) => {
        let user = snapshot.val()
        if (user.groupRequests == undefined) {
            user.groupRequests = []
        }
        user.groupRequests.push(groupId)
        update(ref(rdb, `users/${user.id}`), user)
    })

    get(child(rdbRef, `groups/${groupId}`)).then((snapshot) => {
        let group = snapshot.val()
        if (group.unconfirmedUsers == undefined) {
            group.unconfirmedUsers = []
        }
        group.unconfirmedUsers.push(userId)
        update(ref(rdb, `groups/${groupId}`), group)
    })
}

export function removeGroupRequest(groupId, userId) {
    get(child(rdbRef, `users/${userId}`)).then((snapshot) => {
        let user = snapshot.val()
        user.groupRequests = user.groupRequests.filter(element => element !== groupId)
        update(ref(rdb, `users/${user.id}`), user)
    })

    get(child(rdbRef, `groups/${groupId}`)).then((snapshot) => {
        let group = snapshot.val()
        group.unconfirmedUsers = group.unconfirmedUsers.filter(element => element !== userId)
        update(ref(rdb, `groups/${groupId}`), group)
    })
}