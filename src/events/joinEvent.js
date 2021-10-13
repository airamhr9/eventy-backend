import { DatabaseManager } from '../database/databaseManager.js'


const dbm = new DatabaseManager

export function joinEvent(eventId, userId, res){ 
    res.send(dbm.addParticipantToEvent(eventId, userId)) 
}