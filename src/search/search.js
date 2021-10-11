import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

export function search(searchText, searchTags, res){
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
        
        returnEvents(res, result)
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
    return "no se pudo encontrar"
  }
}

function returnEvents(res, result){
  try {
    res.send(result)
  } catch (error) {
    return "no se pudo enviar"
  }
}