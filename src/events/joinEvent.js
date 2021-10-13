import { DatabaseManager } from '../database/databaseManager.js'


const dbm = new DatabaseManager

export function joinEvent(eventId, userId){ 
    return dbm.addParticipantToEvent(eventId, userId)
}