import express from 'express'
import multer from 'multer'
import { readFile, unlink } from 'fs'

import { recomend } from './search/recomendations.js'
import { search } from './search/search.js'
import { getTags } from './tags.js'
import { getUserPreferences, setUserPreferences } from './users/userPreferences.js'
import { getUser, updateUser, user } from './users/userProfile.js'
import { createCommunity, getCommunityById, community, listUserCommunities, userCommunities, joinCommunity
    } from './communities/community.js'
import { getEvent, event, getEventParticipants, eventParticipants, listUserOlderEvents, userOlderEvents } from './events/participants.js'
import { publishEvent } from './events/publish.js'
import { joinEvent } from './events/joinEvent.js'
import { login } from './users/login.js'
import { register } from './users/register.js'
import { replaceImagesWithURL_Event, replaceImagesWithURL_User, replaceImagesWithURL_Community,
    objectWithURLs, uploadImage } from './images.js'
import { eventChat, sendMssg } from './events/chat.js'
import { communityChat, sendMssgComm } from './communities/chatCommunity.js'
import { searchComm } from './search/searchCommunity.js'
import { saveToLater } from './events/seeItLater.js'
import { getLaterEvents } from './events/seeItLater.js'
import { getFriends, friendsAndFriendshipRequests, beFriends, notBeFriends, makeFriendshipRequest } from './users/friends.js'
import { searchUsers } from './users/searchUsers.js'
import { createPost, getAllPosts, getPost, commentPost, getComments, like, dislike } from './communities/muro.js'
import { sendUserGroups, sendUserGroupRequests, createGroup, updateGroup, addGroupMembersToEvent,
    removeGroupRequest, addGroupRequestToUsers } from './users/groups.js'
import { sendUserEventScore, addEventScore } from './events/eventScores.js'
import { filterByGroup } from './users/groupsFilter.js'
import { stdout } from 'process'

const app = express()
const port = process.env.PORT || 8000

const upload = multer({ dest: 'uploads/' })

app.use(express.json())

app.get('/tags', (req, res) => {
    getTags(res)
})

app.get('/search', (req, res) =>{
    let txt = req.query.text
    let tags = req.query.tags
    let loc = [req.query.lat, req.query.long]
    let filt = [req.query.unique, req.query.sDate, req.query.fDate, req.query.price, loc, req.query.priceMin]
    search(txt, tags, filt, req.query.enabled, res)
})

app.get('/searchComm', (req, res) =>{
    let txt = req.query.text
    let tags = req.query.tags
    searchComm(txt, tags, res)
})

app.get('/recomend', (req, res) =>{
    let userId = req.query.userId
    let lat = req.query.latitude
    let lon = req.query.longitude
    let page = req.query.page

    recomendation(userId, lat, lon, page)
    async function recomendation(id, latitude, longitude, pag){
        await getUser(id, false)
        recomend(res, user, latitude, longitude, pag)
    }
})

app.get('/events', async (req, res) => {
    if (req.query.participants != undefined) { 
        await getEventParticipants(req.query.id)
        res.send(eventParticipants)
    } else {
        await getEvent(req.query.id)
        await replaceImagesWithURL_Event(event)
        res.send(objectWithURLs)
    }
})

app.post('/events', (req,res) => {
    publishEvent(req.body.description, req.body.finishDate, req.body.images, req.body.latitude, req.body.longitude,
        req.body.maxParticipants, req.body.name, req.body.owner, req.body.price, req.body.private, req.body.startDate,
        req.body.summary, req.body.tags)
    res.send()
})

app.post('/joinEvent', (req, res) => {
    let confirmed
    if (req.query.confirmed.toLowerCase() == 'false') {
        confirmed = false
    } else {
        confirmed = true
    }
    joinEvent(req.query.eventId, req.query.userId, confirmed)
    res.send()
})

app.post('/joinCommunity', (req, res) => {
    joinCommunity(req.query.communityId, req.query.userId)
    res.send()
})

app.get('/login', (req, res) => {
    login(req.query.username, req.query.password, res)
})

app.post('/register', (req,res) => {
    register(req.query.username , req.query.password, req.query.email, req.query.birthdate, res)
})

app.get('/users', async (req, res) => {
    if (req.query.preferences != undefined) {
        getUserPreferences(res, req.query.id)
    } else if (req.query.olderEvents != undefined) {
        await listUserOlderEvents(req.query.id)
        let result = []
        for (let ev of userOlderEvents) {
            await replaceImagesWithURL_Event(ev)
            result.push(objectWithURLs)
        }
        res.send(result)
    } else {
        await getUser(req.query.id)
        user.imageName = user.image
        await replaceImagesWithURL_User(user)
        res.send(objectWithURLs)
    }
})

app.put('/users', (req, res) => {
    if (req.query.preferences != undefined) {
        setUserPreferences(req.query.id, req.body)
    } else {
        updateUser(req.body)
    }
    res.send()
})

app.get('/communities', async (req, res) => {
    if (req.query.user != undefined) {
        await listUserCommunities(req.query.user)
        let result = []
        for (let com of userCommunities) {
            await replaceImagesWithURL_Community(com)
            result.push(objectWithURLs)
        }
        res.send(result)
    } else if (req.query.id != undefined) {
        await getCommunityById(req.query.id)
        await replaceImagesWithURL_Community(community)
        res.send(objectWithURLs)
    } else {
        res.send('Not supported')
    }
})

app.post('/communities', (req, res) => {
    createCommunity(req.body, res)
})

app.get('/chat', (req, res) =>{
    eventChat(res, req.query.eventId)
})

app.post('/chat', (req, res) =>{
    sendMssg(req.body, req.query.eventId, res)
})

app.get('/chatComm', (req, res) =>{
    communityChat(res, req.query.commId)
})

app.post('/chatComm', (req, res) =>{
    sendMssgComm(req.body, req.query.commId, res)
})

app.post('/images', upload.single('photo'), (req, res) => {
    readFile(req.file.path, (err, data) => {
        if (req.query.type == 'user') {
            uploadImage(data, `users/${req.query.name}`)
        } else if (req.query.type == 'event') {
            uploadImage(data, `events/${req.query.name}`)
        } else if (req.query.type == 'post') {
            uploadImage(data, `posts/${req.query.name}`)
        } else {
            uploadImage(data, `communities/${req.query.name}`)
        }
    })
    unlink(req.file.path, (err) => {})
    res.send()
})

app.post('/multiImages', upload.array('photo', 6), (req, res) => {
   for(var i = 0; i < 6; i++){
    readFile(req.files[i].path, (err, data) => {
        if (req.query.type == 'user') {
            uploadImage(data, `users/${req.query.name}`)
        } else if (req.query.type == 'event') {
            uploadImage(data, `events/${req.query.name}`)
        } else {
            uploadImage(data, `communities/${req.query.name}`)
        }
        })
    }
})

app.post('/seeItLater', (req, res) => {
    saveToLater(req.query.userId, req.query.eventId)
    res.send()
})

app.get('/seeItLater', (req, res) => {
    getLaterEvents(req.query.userId, res)
})

app.get('/friends', async (req, res) => {
    await getFriends(req.query.user)
    res.send(friendsAndFriendshipRequests)
})

app.post('/friends', (req, res) => {
    if (req.query.op.toUpperCase() == 'REQUEST') {
        try {
            makeFriendshipRequest(req.query.userId1, req.query.username2)
            res.send()
        } catch (error) {
            res.send('El usuario introducido no existe')
        }
    } else if (req.query.op.toUpperCase() == 'ACCEPT') {
        beFriends(req.query.userId1, req.query.username2)
        res.send()
    } else if (req.query.op.toUpperCase() == 'REJECT') {
        notBeFriends(req.query.userId1, req.query.username2)
        res.send()
    } else {
        res.send('Operation not supported')
    }
})

app.get('/searchUsers', (req, res) => {
    searchUsers(req.query.search, res)
})

app.post('/post', (req,res) => {
    createPost(req.query.idCommunity, req.query.title, req.query.text, req.query.date, req.query.author, req.query.images, res)
})

app.get('/allPosts', (req,res) => {
    getAllPosts(req.query.idCommunity,res)
})

app.get('/post', (req,res) => {
    getPost(req.query.idPost, res)
})

app.post('/comment', (req,res) => {
    commentPost(req.query.idCommunity, req.query.idPost, req.query.author, req.query.comment, req.query.date, res)
})

app.get('/comments', (req,res) => {
    getComments(req.query.idPost, res)
})

app.post('/like' , (req, res) => {
    like(req.query.idPost, res)
})

app.post('/dislike' , (req, res) => {
    dislike(req.query.idPost, res)
})

app.get('/groups', (req, res) => {
    if (req.query.type.toUpperCase() == 'JOINED') {
        sendUserGroups(req.query.user, res)
    } else if (req.query.type.toUpperCase() == 'REQUESTS') {
        sendUserGroupRequests(req.query.user, res)
    } else {
        res.send('Operation not supported')
    }    
})

app.post('/groups/:ids', (req, res) => {
    stdout.write(req.params.ids);
    let groupId = createGroup(req.query.creator)
    addGroupRequestToUsers(groupId, req.params.ids.split(","))
    res.send()
})

app.put('/groups', (req, res) => {
    if (req.query.event != undefined) {
        addGroupMembersToEvent(req.query.group, req.query.event)
    } else if (req.query.op != undefined) {
        if (req.query.op.toUpperCase() == 'REQUEST') {
            addGroupRequestToUsers(req.query.group, req.body)
        } else if (req.query.op.toUpperCase() == 'REJECT') {
            removeGroupRequest(req.query.group, req.query.user)
        }
    } else {
        updateGroup(req.query.group, req.body)
    }
    res.send()
})

app.get('/searchGroups', (req, res) => {
    filterByGroup(res, req.query.groupId)
})

app.get('/eventScores', (req, res) => {
    sendUserEventScore(req.query.user, req.query.event, res)
})

app.post('/eventScores', (req, res) => {
    addEventScore(req.query.user, req.query.event, parseFloat(req.query.score))
    res.send()
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})