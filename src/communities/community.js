import { child, get, ref, set } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

export async function createCommunity(community, res) {
    await generateCommunityId()
    set(ref(rdb, `communities/${nextCommunityId}`), {
        creator: community.creator,
        description: community.description,
        id: nextCommunityId,
        images: community.images,
        logo: community.logo,
        members: [],
        name: community.name,
        private: community.private,
        tags: community.tags
    }).then(() => {
        community.id = nextCommunityId
        community.members = []
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