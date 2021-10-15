import { Event } from '../objects/event.js'
import { DatabaseManager } from '../database/databaseManager.js'

const dbm = new DatabaseManager


export function publishEvent(description, finishDate, images, latitude, longitude, maxParticipants, name, owner,
    price, isPrivate, startDate, summary, tags) { 
    const newEvent = new Event( description, 
                                finishDate, 
                                images, 
                                latitude,
                                longitude, 
                                maxParticipants, 
                                name, 
                                owner, 
                                price, 
                                isPrivate, 
                                startDate,
                                summary,
                                tags)

        dbm.uploadEvent(newEvent)
        return true
    }
