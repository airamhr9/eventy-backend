import { ref, getDownloadURL, uploadBytes } from "firebase/storage"
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
        await getFileURL(`images/events/${image}`)            
        imagesURLs.push(fileURL)
    }
    event.images = imagesURLs
    objectWithURLs = event
}

export async function replaceImagesWithURL_User(user) {
    await getFileURL(`images/users/${user.image}`)
    user.image = fileURL
    objectWithURLs = user
}

export async function replaceImagesWithURL_Community(community) {
    let imagesURLs = []
    for (let image of community.images) {
        await getFileURL(`images/communities/${image}`)            
        imagesURLs.push(fileURL)
    }
    community.images = imagesURLs
    await getFileURL(`images/communities/${community.logo}`)
    community.logo = fileURL
    objectWithURLs = community
}

export function uploadImage(file, path) {
    let extension = path.split('.')
    extension = extension[extension.length - 1]
    uploadFile(file, `images/${path}`, `image/${extension}`)
}

function uploadFile(file, path, contentType) {
    let metadata = {
        contentType: contentType,
    }
    uploadBytes(ref(storage, path), file, metadata)
}