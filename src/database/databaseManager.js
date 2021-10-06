import { ref, set } from "firebase/database"
import { rdb } from '../index.js'


export class DatabaseManager {
    uploadEvent(eventToUpload){
        print("Subido!")
        //set(ref(rdb, 'events/' + "3000"), { newEvent })
    }

}
