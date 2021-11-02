import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'
import { objectWithURLs, replaceImagesWithURL_Community } from '../images.js'

const rdbRef = ref(rdb)

export function searchComm(searchText, searchTags, res){
    get(child(rdbRef, 'communities/')).then((snapshot) =>{
      if(snapshot.exists()){
        let result = []
        let events = snapshot.val()

        events.forEach(element => {  
          let names = makeLowerCase(element.name)
          let tags = element.tags

          if(names.includes(makeLowerCase(searchText))){
            if(element.tags != undefined && findCommonElements(tags, searchTags) && element.private == false){
              result.push(element)
            }
            else if(element.tags == undefined && element.private == false && searchTags == []){
              result.push(element)
            }
            else if(element.tags != undefined && element.private == false && searchTags == []){
              result.push(element)
            }
          }
        })
        
        returnComm(res, result)
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

async function returnComm(res, events){
  try {
    let result = []
    for (let ev of events) {
      await replaceImagesWithURL_Community(ev)
      result.push(objectWithURLs)
    }
    res.send(result)
  } catch (error) {
    return "no se pudo enviar"
  }
}