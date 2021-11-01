import { DatabaseManager } from '../database/databaseManager.js'


const dbm = new DatabaseManager

export function joinEvent(eventId, userId, confirmed) { 
    dbm.addParticipantToEvent(eventId, userId, confirmed)
}