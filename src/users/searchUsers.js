import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'
import { replaceImagesWithURL_User, objectWithURLs } from '../images.js'

const rdbRef = ref(rdb)

export function searchUsers(search, res) {
    get(child(rdbRef, 'users')).then(async (snapshot) => {
        let result = []
        if (snapshot.exists()) {
            let users = snapshot.val()
            users = Object.values(users)            
            for (let user of users) {
                if (user.username.toLowerCase().includes(search.toLowerCase())) {
                    if (user.preferences == undefined) {
                        user.preferences = []
                    }
                    if (user.friends == undefined) {
                        user.friends = []
                    }
                    if (user.friendshipRequests == undefined) {
                        user.friendshipRequests = []
                    }
                    await replaceImagesWithURL_User(user)
                    result.push(objectWithURLs)
                }
            }
        }
        res.send(result)
    }).catch((error) => {
        console.error(error)
    })
}