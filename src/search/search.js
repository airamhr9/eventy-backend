import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'
import { replaceImagesWithURL_Event, objectWithURLs } from '../images.js'

const rdbRef = ref(rdb)

export function search(searchText, searchTags, filters, enableFilt, res){
    get(child(rdbRef, 'events/')).then((snapshot) =>{
      if(snapshot.exists()){
        let result = []
        let events = snapshot.val()

        events.forEach(element => {
          if (element.participants == undefined) {
            element.participants = []
          }

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
        if(enableFilt != false){filter(filters, result, res)}
        else{returnEvents(res, result)}
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

function filter(filters, searchedEvents, res){
  let resultFilter = []
  searchedEvents.forEach(element => {
    let sDate = new Date(element.startDate).getDate()
    let fDate = new Date(element.finishDate).getDate()
    let pr = element.price
    let loc = [element.latitude, element.longitude]

    if(filters[0] != false && new Date(filters[1]).getDate() == sDate && sDate == fDate){
      if((filters[3] >= pr || filters[3] == undefined) && (filters[4] == loc || filters[4] == undefined)){
        resultFilter.push(element)
      }
    }
    else if(filters[0] != true && new Date(filters[1]).getDate() == sDate && new Date(filters[2]).getDate() == fDate && sDate != fDate){
      if((filters[3] >= pr || filters[3] == "") && (filters[4] == loc || filters[4] == "")){
        resultFilter.push(element)
      }
    }
  })
  returnEvents(res, resultFilter)
}

async function returnEvents(res, events){
  try {
    let result = []
    for (let ev of events) {
      await replaceImagesWithURL_Event(ev)
      result.push(objectWithURLs)
    }
    res.send(result)
  } catch (error) {
    return "no se pudo enviar"
  }
}