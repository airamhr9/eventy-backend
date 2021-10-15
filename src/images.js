import { ref, getDownloadURL } from "firebase/storage"
import { storage } from "./index.js";

export let fileURL

export async function getFileURL(path) {
    await getDownloadURL(ref(storage, path)).then((url) => {
        fileURL = url
    }).catch((error) => {
        fileURL = 'File does not exist'
    })
}

export let objectWithURLs

export async function replaceImagesWithURL_Event(event) {
    let imagesURLs = []
    for (let image of event.images) {
        await getFileURL(image)            
        imagesURLs.push(fileURL)
    }
    event.images = imagesURLs
    objectWithURLs = event
}

export async function replaceImagesWithURL_User(user) {
    await getFileURL(user.image)
    user.image = fileURL
    objectWithURLs = user
}

export async function replaceImagesWithURL_Community(community) {
    let imagesURLs = []
    for (let image of community.images) {
        await getFileURL(image)            
        imagesURLs.push(fileURL)
    }
    community.images = imagesURLs
    await getFileURL(community.logo)
    community.logo = fileURL
    objectWithURLs = community
}