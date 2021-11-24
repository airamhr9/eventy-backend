import { DatabaseManager } from '../database/databaseManager.js'


const dbm = new DatabaseManager

export async function joinEvent(eventId, userId, confirmed) { 
    await dbm.addParticipantToEvent(eventId, userId, confirmed)
}