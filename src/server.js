import express from 'express'

import { recomend } from './search/recomendations.js'
import { search } from './search/search.js'
import { getTags } from './tags.js'
import { getUserPreferences, setUserPreferences } from './users/userPreferences.js'
import { getUser, updateUser, user } from './users/userProfile.js'
import { createCommunity } from './communities/community.js'
import { getEvent, event, getEventParticipants, eventParticipants } from './events/participants.js'
import { publishEvent } from './events/publish.js'
import { joinEvent } from './events/joinEvent.js'

const app = express()
const port = process.argv[2] || 8000

app.use(express.json())

app.get('/tags', (req, res) => {
    getTags(res)
})

app.get('/search', (req, res) =>{
    let txt = req.query.text
    let tags = req.query.tags
    search(txt, tags, res)
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

app.get('/publish', (req,res) => {
    if(publishEvent(req.body.description, req.body.finishDate, req.body.images, req.body.location, req.body.maxParticipants, req.body.name, req.body.owner,
        req.body.price, req.body.private, req.body.startDate, req.body.summary, req.body.tags) == Boolean(True)){
            res.send(Boolean(True))
        }
}) 

app.get('/joinEvent', (req,res) => {
    if(joinEvent(req.body.eventId, req.body.userId) == Boolean(True)){
        res.send(Boolean(True))
    }
})

app.get('/users', (req, res) => {
    if (req.query.preferences == 'true') { // No borrar el " == 'true' "
        getUserPreferences(res, req.query.id)
    } else {
        getUser(req.query.id, true, res)
    }
})

app.post('/users', (req, res) => {
    if (req.query.preferences == 'true') { // No borrar el " == 'true' "
        setUserPreferences(req.query.id, req.body)
        res.send()
    } else {
        updateUser(req.body)
        res.send()
    }
})

app.get('/events', async (req, res) => {
    if (req.query.participants == 'true') { 
        await getEventParticipants(req.query.id)
        res.send(eventParticipants)
    } else {
        await getEvent(req.query.id)
        res.send(event)
    }
})
//publishEvent(description, finishDate, images, location, maxParticipants, name, owner, price, private, startDate, summary, tags, res)

app.put('/communities', (req, res) => {
    createCommunity(req.body, res)
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})


// Código de ejemplo
/*async function prueba() {
    await getUser(1, false)
    console.log(user)
}
prueba()*/