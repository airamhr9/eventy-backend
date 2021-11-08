import { getUser, getUserByUsername, user, updateUser } from './userProfile.js'
import { replaceImagesWithURL_User, objectWithURLs } from '../images.js'

export let friendsAndFriendshipRequests
export async function getFriends(userId) {
    await getUser(userId)
    let myUser = user
    let friends = []
    let friendshipRequests = []
    for (let username of myUser.friends) {
        await getUserByUsername(username)
        await replaceImagesWithURL_User(user)
        friends.push(objectWithURLs)        
    }
    for (let username of myUser.friendshipRequests) {
        await getUserByUsername(username)
        await replaceImagesWithURL_User(user)
        friendshipRequests.push(objectWithURLs)
    }
    friendsAndFriendshipRequests = [friends, friendshipRequests]
}

export async function beFriends(userId1, username2) {
    await getUser(userId1)
    let user1 = user
    await getUserByUsername(username2)
    let user2 = user
    addFriendToUser(user1, user2) 
    addFriendToUser(user2, user1)
    user1.friendshipRequests = removeFrienshipRequest(user1.friendshipRequests, user2.username)
    user2.friendshipRequests = removeFrienshipRequest(user2.friendshipRequests, user1.username)
    updateUser(user1)
    updateUser(user2)
}

function addFriendToUser(user, newFriend) {
    user.friends.push(newFriend.username)
}

export async function notBeFriends(userId1, username2) {
    await getUser(userId1)
    user.friendshipRequests = removeFrienshipRequest(user.friendshipRequests, username2)
    updateUser(user)
}

function removeFrienshipRequest(requestsList, username) {
    return requestsList.filter(element => element !== username)
}

export async function makeFriendshipRequest(userSenderId, userReceiverUsername) {
    await getUserByUsername(userReceiverUsername)
    let receiver = user
    await getUser(userSenderId)
    let sender = user
    receiver.friendshipRequests.push(sender.username)
    updateUser(receiver)
}