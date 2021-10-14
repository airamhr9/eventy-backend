import { ref, getDownloadURL } from "firebase/storage"
import { storage } from "./index.js";

let storageRef = ref(storage, 'user.png')
getDownloadURL(storageRef).then((url) => {
    console.log(url)
})