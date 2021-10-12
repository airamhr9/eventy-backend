import express from 'express'
import { Event } from '../objects/event.js'
import { DatabaseManager } from '../database/databaseManager.js'

const app = express()
const dbm = new DatabaseManager

app.use(express.json)

app.post('/publish', function (req, res){ 
    const newEvent = new Event( req.body.description, 
                                req.body.finishDate, 
                                req.body.images, 
                                req.body.location, 
                                req.body.maxParticipants, 
                                req.body.name, 
                                req.body.owner, 
                                req.body.price, 
                                req.body.private, 
                                req.body.startDate,
                                req.body.summary,
                                req.body.tags,)

        dbm.uploadEvent(newEvent)
        
        res.status(Boolean.True).send()

    })