import { child, DataSnapshot, get, ref } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

get(child(rdbRef, "events")).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

/*function search(searchText, searchTags){
    
}*/