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

          if(names.includes(makeLowerCase(searchText))  && element.community == null){
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
        if(enableFilt == undefined){returnEvents(res, result)}
        else{filter(filters, result, res)}
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

    if(filters[1] == undefined || filters[1] == ""){
      filters[1] = new Date(Date.now()).toISOString()
    }

    if(filters[0] == true){
      if(new Date(filters[1]).getDate() <= sDate && new Date(filters[2]).getDate() >= fDate && sDate == fDate){ //entre las fechas ini y fin del filtro y que solo dure un dia
        if((filters[3] >= pr || filters[3] == undefined) && (pr >= filters[5] || filters[5] == undefined)){
          if(plusMinus(filters[4], loc, 0.2) != false || filters[4].includes(undefined)){
            resultFilter.push(element)
          }
        }
      }
      else if(new Date(filters[1]).getDate() <= sDate && filters[2] == undefined && sDate == fDate){ //a partir de la fecha actual y que dure solo un dia
        if((filters[3] >= pr || filters[3] == undefined) && (pr >= filters[5] || filters[5] == undefined)){
          if(plusMinus(filters[4], loc, 0.2) != false || filters[4].includes(undefined)){
            resultFilter.push(element)
          }
        }
      }
    }
    else{
      if(new Date(filters[1]).getDate() <= sDate && new Date(filters[2]).getDate() >= fDate){ // entre las fechas ini y fin del filtro
        if((filters[3] >= pr || filters[3] == undefined) && (pr >= filters[5] || filters[5] == undefined)){
          if(plusMinus(filters[4], loc, 0.2) != false || filters[4].includes(undefined)){
            resultFilter.push(element)
          }
        }
      }
      else if(new Date(filters[1]).getDate() <= sDate && filters[2] == undefined){ //a partir de la fecha actual
        if((filters[3] >= pr || filters[3] == undefined) && (pr >= filters[5] || filters[5] == undefined)){
          if(plusMinus(filters[4], loc, 0.2) != false || filters[4].includes(undefined)){
            resultFilter.push(element)
          }
        } 
      }
    }
  })
  returnEvents(res, resultFilter)
}

function plusMinus(n1, n2, diff){
  if (Math.abs(n1[0] - n2[0]) <= diff && Math.abs(n1[1] - n2[1]) <= diff) {
    return true
  }
  else{
    return false
  }
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

export async function searchT(searchText, searchTags, filters, enableFilt){ //version for testing with return
  get(child(rdbRef, 'events/')).then((snapshot) =>{
    if(snapshot.exists()){
      let result = []
      let events = snapshot.val()

      for (const key in events) {
        if (events[key].participants == undefined) {
          events[key].participants = []
        }

        let names = makeLowerCase(events[key].name)
        let tags = events[key].tags

        if(names.includes(makeLowerCase(searchText) && events[key].community == null)){
          console.log(events[key].community)
          if(events[key].tags != undefined && findCommonElements(tags, searchTags) && events[key].private == false){
            result.push(events[key])
          }
          else if(events[key].tags == undefined && events[key].private == false && searchTags == []){
            result.push(events[key])
          }
          else if(events[key].tags != undefined && events[key].private == false && searchTags == []){
            result.push(events[key])
          }
        }
      }
      if(enableFilt == true){
          return filterT(filters, result)
      }
      else{
        return result
      }
    }
  })
}

function filterT(filters, searchedEvents){
  let resultFilter = []
  searchedEvents.forEach(element => {
    let sDate = new Date(element.startDate).getDate()
    let fDate = new Date(element.finishDate).getDate()
    let pr = element.price
    let loc = [element.latitude, element.longitude]

    if(filters[1] == undefined || filters[1] == ""){
      filters[1] = new Date(Date.now()).toISOString()
    }

    if(filters[0] == true){
      if(new Date(filters[1]).getDate() <= sDate && new Date(filters[2]).getDate() >= fDate && sDate == fDate){ //entre las fechas ini y fin del filtro y que solo dure un dia
        if((filters[3] >= pr || filters[3] == undefined) && (pr >= filters[5] || filters[5] == undefined)){
          if(plusMinus(filters[4], loc, 0.2) != false || filters[4].includes(undefined)){
            resultFilter.push(element)
          }
        }
      }
      else if(new Date(filters[1]).getDate() <= sDate && filters[2] == undefined && sDate == fDate){ //a partir de la fecha actual y que dure solo un dia
        if((filters[3] >= pr || filters[3] == undefined) && (pr >= filters[5] || filters[5] == undefined)){
          if(plusMinus(filters[4], loc, 0.2) != false || filters[4].includes(undefined)){
            resultFilter.push(element)
          }
        }
      }
    }
    else{
      if(new Date(filters[1]).getDate() <= sDate && new Date(filters[2]).getDate() >= fDate){ // entre las fechas ini y fin del filtro
        if((filters[3] >= pr || filters[3] == undefined) && (pr >= filters[5] || filters[5] == undefined)){
          if(plusMinus(filters[4], loc, 0.2) != false || filters[4].includes(undefined)){
            resultFilter.push(element)
          }
        }
      }
      else if(new Date(filters[1]).getDate() <= sDate && filters[2] == undefined){ //a partir de la fecha actual
        if((filters[3] >= pr || filters[3] == undefined) && (pr >= filters[5] || filters[5] == undefined)){
          if(plusMinus(filters[4], loc, 0.2) != false || filters[4].includes(undefined)){
            resultFilter.push(element)
          }
        } 
      }
    }
  })
  return resultFilter
}