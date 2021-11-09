import { child, get, ref, set, update, push, getDatabase } from '@firebase/database'
import { async } from '@firebase/util'
import { rdb } from '../index.js'

const rdbRef  = ref(rdb)
const db = getDatabase()

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
        images : post.images   
    }).catch((error) => {console.error(error)})

    res.send(idKey)

}

export async function getAllPosts(idCommunity, res) {
    get(child(rdbRef,`communities/${idCommunity}/posts/`)).then((snapshot) => {
        if(snapshot.exists()){
            let posts = snapshot.val()
            res.send(posts)
        }else{
            res.send([])
        }
    }).catch((error) => {console.error(error)})
}

export async function getPost(idPost, res) {
    const idCommunity = await getCommunityByPost(idPost)
    get(child(rdbRef,`communities/${idCommunity}/posts/${idPost}/`)).then((snapshot) => {
        if(snapshot.exists()){
            let post = snapshot.val()
            res.send(post)
        }else{
            res.send([])
        }
    }).catch((error) => {console.error(error)})

}

export async function commentPost(idCommunity, idPost, author, comment, date, res) {
    const rdbRefP = ref(rdb,`communities/${idCommunity}/posts/${idPost}/comments`)
    const newRef = push(rdbRefP) 
    const idKey = newRef.key

    set(newRef,
        {   
            id : idKey,
            author : author,
            comment : comment,
            date : date,
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

    await get(child(rdbRef,`communities/${idCommunity}/posts/${idPost}`)).then((snapshot) => {
        if(snapshot.exists()){res.send(snapshot.val().comments)}
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
