import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

function search(searchText, searchTags){

    get(child(rdbRef, 'events/')).then((snapshot) =>{
      if(snapshot.exists()){
        let result = []
        let events = snapshot.val()

        events.forEach(element => {
          let names = makeLowerCase(element.name)

          if(names.includes(makeLowerCase(searchText))){
            result.push(element)
          }
        })

        returnEvents(result)
      }
    })
}

search('DE', [])

function makeLowerCase(value) {
  return value.toString().toLowerCase();
}

function returnEvents(result){
  console.log(result)
}