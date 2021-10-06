import express from 'express'
import { Event } from '../objects/event.js'
import { DatabaseManager } from '../database/databaseManager.js'

const app = express()
const dbm = new DatabaseManager
app.use(express.json)

app.post('/publish', function (req, res){
    var result = checkEvent(  req.body.name,
                              req.body.startDate,
                              req.body.FinishDate,
                              req.body.location,
                              req.body.description,
                              req.body.summary,
                              req.body.private,
                              req.body.images,
                              req.body.maxParticipants,
                              req.body.price,
                              req.body.tags )

    if(result == "True"){
        const newEvent = new Event( "3000", 
                                req.body.name, 
                                req.body.startDate, 
                                req.body.FinishDate, 
                                req.body.location, 
                                req.body.description, 
                                req.body.summary, 
                                req.body.private, 
                                req.body.images, 
                                req.body.maxParticipants, 
                                req.body.price,
                                "owner",
                                "chat",
                                req.body.tags)

        dbm.uploadEvent(newEvent)
        
        res.status(result).send()

    } else{ res.status(result).send()}
})








