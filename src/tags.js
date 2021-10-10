import { child, get, ref } from '@firebase/database'
import { rdb } from './index.js'

const rdbRef = ref(rdb)

export function getTags(res) {
    get(child(rdbRef, 'tags')).then((snapshot) => {
        if (snapshot.exists()) {
            let tags = snapshot.val()
            res.send(tags)
        } else {
            res.send([])
        }
      }).catch((error) => {
        console.error(error)
      });
}