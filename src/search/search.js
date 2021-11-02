import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'
import { replaceImagesWithURL_Event, objectWithURLs } from '../images.js'

const rdbRef = ref(rdb)

export function search(searchText, searchTags, filters, res){
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
          }
        })
        if(filters != undefined){filter(filters, result)}
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

function filter(filters, searchedEvents){
  let resultFilter = []
  searchedEvents.forEach(element => {
    let sDate = element.startDate
    let fDate = element.finishDate
    let pr = element.price
    let loc = [element.latitude, element.longitude]

    if(filters.unique && filters.startDate == sDate){
      if(filters.price >= pr && filters.localization == loc){
        resultFilter.push(element)
      }
    }
    else if(!filters.unique && filters.startDate == sDate && filters.finishDate == fDate){
      if(filters.price >= pr && filters.localization == loc){
        resultFilter.push(element)
      }
    }
    else if(!filters.unique && filters.startDate == undefined){
      if(filters.price >= pr && filters.localization == loc){
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