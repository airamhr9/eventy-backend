import express from 'express'
import { Event } from '../objects/event.js'
import { DatabaseManager } from '../database/databaseManager.js'

const app = express()
const dbm = new DatabaseManager


export function publishEvent(description, finishDate, images, location, maxParticipants, name, owner, price, private, startDate, summary, tags){ 
    const newEvent = new Event( description, 
                                finishDate, 
                                images, 
                                location, 
                                maxParticipants, 
                                name, 
                                owner, 
                                price, 
                                private, 
                                startDate,
                                summary,
                                tags,)

        dbm.uploadEvent(newEvent)
        return true
    }