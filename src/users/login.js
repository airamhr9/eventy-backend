import { DatabaseManager } from '../database/databaseManager.js'


const dbm = new DatabaseManager

export async function login(userName, password){ 
    if(await dbm.getUserPasswordByName(userName) == password){
        return "true"
    }else{
        return "false"
    }
}
