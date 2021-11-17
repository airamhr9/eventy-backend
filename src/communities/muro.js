import { child, get, ref, set, update, push, getDatabase } from '@firebase/database'
import { async } from '@firebase/util'
import { objectWithURLs, replaceImagesWithURL_Post, uploadImage, sendCommentsWithImages, sendPostsWithImages } from '../images.js'
import { rdb } from '../index.js'
import { Message } from '../objects/message.js'
import { Post } from '../objects/post.js'

const rdbRef  = ref(rdb)
const db = getDatabase()
export let post


export async function createPost(idCommunity, post, res) {
    const rdbRefC = ref(rdb,`communities/${idCommunity}/posts/`)
    const newRef = push(rdbRefC)
    const idKey = newRef.key

    set(newRef,
    {   
        id : idKey,
        title : post.title,
        text : post.text,
        date : post.date,
        author : post.author,
        numComments : 0, 
        images : post.images,
        likes : post.likes,
        dislikes : post.dislikes,
        location : post.location,

    }).catch((error) => {console.error(error)})
    res.send(idKey)

}

export async function getAllPosts(idCommunity, res) {
    get(child(rdbRef,`communities/${idCommunity}/posts/`)).then((snapshot) => {
        if(snapshot.exists()){
            const posts = snapToArray(snapshot)
            sendPostsWithImages(posts,res)
        }else{
            res.send([])
        }
    }).catch((error) => {console.error(error)})
}

export async function getPost(idPost, res) {
    const idCommunity = await getCommunityByPost(idPost)
    get(child(rdbRef,`communities/${idCommunity}/posts/${idPost}/`)).then((snapshot) => {
        if(snapshot.exists()){
            post = snapshot.val()
            if(typeof post.images == 'undefined'){
                res.send(post)
            }else{
                replaceImagesWithURL_Post(post, res)
            }
        }else{
            post = []
            res.send(post)
        }
    }).catch((error) => {console.error(error)})

}

export async function commentPost(idPost,message, res ) {
    const idCommunity = await getCommunityByPost(idPost)

    const rdbRefP = ref(rdb,`communities/${idCommunity}/posts/${idPost}/comments`)
    const newRef = push(rdbRefP) 
    const idKey = newRef.key

    set(newRef,
        {   
            id : idKey,
            userId : message.userId,
            username : message.username, 
            text : message.text,
            dateTime : message.time,
            images : message.images
        }).catch((error) => {console.error(error)}
    )
    
    await get(child(rdbRef,`communities/${idCommunity}/posts/${idPost}`)).then((snapshot) => {
        if(snapshot.exists()){ 
            const numComments = 1 + snapshot.val().numComments
            update(child(rdbRef,`communities/${idCommunity}/posts/${idPost}`), {numComments : numComments })
        }
    }).catch((error) => { console.error(error) })  
    res.send(idKey)
}

export async function getComments(idPost, res){  
    const idCommunity = await getCommunityByPost(idPost)
    let images = []

    await get(child(rdbRef,`communities/${idCommunity}/posts/${idPost}/comments`)).then((snapshot) => {
        if(snapshot.exists())
        {
            const comments = snapToArray(snapshot)
            sendCommentsWithImages(comments,res)
        }
    }).catch((error) => { console.error(error) })
}   

async function getCommunityByPost(idPost){
    var idCommunity = ""
    var communityArray = []
    await get(child(rdbRef,`communities/`)).then((snapshot) => {
        if(snapshot.exists()){
            for(const community of snapshot.val()){
                communityArray.push(community.id)
            }
        }
    }).catch((error) => { console.error(error) })

    for(const id of communityArray){  
        await get(child(rdbRef,`communities/${id}/posts/${idPost}`)).then((snapshot2) => {
            if(snapshot2.exists()){
                idCommunity = id
            }
        }).catch((error) => { console.error(error) })
    }

    return idCommunity
}


export async function like(idPost, res){
    const idCommunity = await getCommunityByPost(idPost)

    await get(child(rdbRef,`communities/${idCommunity}/posts/${idPost}`)).then((snapshot) => {
        if(snapshot.exists()){ 
            const likes = 1 + snapshot.val().likes
            update(child(rdbRef,`communities/${idCommunity}/posts/${idPost}`), {likes : likes })
        }
    }).catch((error) => { console.error(error) })  
    res.send(idPost)
}

export async function dislike(idPost, res){
    const idCommunity = await getCommunityByPost(idPost)

    await get(child(rdbRef,`communities/${idCommunity}/posts/${idPost}`)).then((snapshot) => {
        if(snapshot.exists()){ 
            const dislikes = 1 + snapshot.val().dislikes
            update(child(rdbRef,`communities/${idCommunity}/posts/${idPost}`), {dislikes : dislikes })
        }
    }).catch((error) => { console.error(error) })  
    res.send(idPost)
}


function snapToArray(snapshot){
    var returnArr = []

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val()
        item.key = childSnapshot.key

        returnArr.push(item)
    })

    return returnArr
}