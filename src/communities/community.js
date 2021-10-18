import { child, get, ref, set } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

export let community

export async function getCommunityById(communityId) {
    await get(child(rdbRef, `communities/${communityId}`)).then((snapshot) => {
        if (snapshot.exists()) {
            community = snapshot.val()
        } else {
            community = 'Community does not exist'
        }
        }).catch((error) => {
            console.error(error)
    });
}

let allCommunities

async function getCommunities() {
    await get(child(rdbRef, 'communities/')).then((snapshot) => {
        if (snapshot.exists()) {
            allCommunities = snapshot.val()
        } else {
            allCommunities = []
        }
        }).catch((error) => {
            console.error(error)
    });
}

export let userCommunities

export async function listUserCommunities(userId) {
    await getCommunities()
    userCommunities = []
    for (let com of allCommunities) {
        if (com.creator == userId || (com.members != undefined && com.members.includes(userId))) {
            userCommunities.push(com)
        }
    }
}

export async function createCommunity(community, res) {
    await generateCommunityId()
    set(ref(rdb, `communities/${nextCommunityId}`), {
        creator: community.creator,
        description: community.description,
        id: nextCommunityId,
        images: community.images,
        logo: community.logo,
        members: community.members,
        name: community.name,
        private: community.private,
        tags: community.tags
    }).then(() => {
        community.id = nextCommunityId
        res.send(community)
    })
}

let nextCommunityId

async function generateCommunityId() {
    await get(child(rdbRef, 'communities')).then((snapshot) => {
        if (snapshot.exists()) {
            let communities = snapshot.val()
            nextCommunityId = communities[communities.length - 1].id + 1
        } else {
            nextCommunityId = 0
        }
        }).catch((error) => {
            console.error(error)
    });
}