import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

search("", ["Museos","Fiesta"])

function search(searchText, searchTags){

    get(child(rdbRef, 'events/')).then((snapshot) =>{
      if(snapshot.exists()){
        let result = []
        let events = snapshot.val()

        events.forEach(element => {
          let names = makeLowerCase(element.name)
          let tags = element.tags


          if(names.includes(makeLowerCase(searchText))){
              if(findCommonElements(tags, searchTags)){
                result.push(element)
              }
          }
        })

        returnEvents(result)
      }
    })
}

function makeLowerCase(value) {
  return value.toString().toLowerCase()
}


function findCommonElements(arr1, arr2) {
  try {
    return arr1.some(item => arr2.includes(item))
  } catch (error) {
    return "mierda"
  }
}

function returnEvents(result){
  console.log(result)
}