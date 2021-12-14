import { ref, getDownloadURL, uploadBytes } from "firebase/storage"
import { storage } from "./index.js";
import { confirmPasswordReset } from "firebase/auth";
import { post } from "./communities/muro.js";

export let fileURL

export async function getFileURL(path) {
    await getDownloadURL(ref(storage, path)).then((url) => {
        fileURL = url
    }).catch((error) => {
        fileURL = `File <${path}> does not exist`
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

export async function replaceImagesWithURL_MssgEvent(mssg, event) {
    await getFileURL(`images/users/${mssg.images}`)
    mssg.images = fileURL
    objectWithURLs = mssg
}

export async function replaceImagesWithURL_MssgCom(mssgC, com) {
    await getFileURL(`images/users/${mssgC.images}`)
    mssgC.images = fileURL
    objectWithURLs = mssgC
}

export async function replaceImagesWithURL_Post(post, res) {
    let imagesURLs = []
    for (let image of post.images) {
        await getFileURL(`images/communities/posts/${image}`)            
        imagesURLs.push(fileURL)
    }
    post.images = imagesURLs
    objectWithURLs = post
    res.send(objectWithURLs)
}

export async function sendCommentsWithImages(comments, res){

    let objectsToSend = []
    for (let comment of comments) {
        const path = `images/users/${comment.images}`
        await getFileURL(path)
        if(fileURL == `File <${path}> does not exist` ){
            objectsToSend.push(comment)
        }else{
            comment.images = fileURL
            objectWithURLs = comment
            objectsToSend.push(comment)
        }      
    }

    res.send(objectsToSend)
}

export async function sendPostsWithImages(posts, res){
    let objectsToSend = []

    for(let post of posts) {
        const path = `images/communities/posts/${post.images}`
        await getFileURL(path)

        if(fileURL == `File <${path}> does not exist` ){
            objectsToSend.push(post)
        }else{
            post.images = fileURL
            objectWithURLs = post
            objectsToSend.push(objectWithURLs)
        }      
    }

    res.send(objectsToSend)
}

export async function sendMemoriesWithImages(memories, res){
    let objectsToSend = []
    for(let memory of memories) {
        const path = `images/events/memories/${memory.images}`
        await getFileURL(path)

        if(fileURL == `File <${path}> does not exist` ){
            objectsToSend.push(memory)
        }else{
            memory.images = fileURL
            objectWithURLs = memory
            objectsToSend.push(objectWithURLs)
        }      
    }
    res.send(objectsToSend)
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