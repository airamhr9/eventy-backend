import { DatabaseManager } from '../database/databaseManager.js'


const dbm = new DatabaseManager

export function joinEvent(eventId, userId){ 
    dbm.addParticipantToEvent(eventId, userId)
}