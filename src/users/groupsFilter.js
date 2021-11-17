import { child, get, ref, set, push, update } from '@firebase/database'
import { rdb } from '../index.js'
import { replaceImagesWithURL_Event, objectWithURLs } from '../images.js'

const rdbRef = ref(rdb)

export function filterByGroup(res, idGroup){
    get(child(rdbRef, `groups/${idGroup}/users/`)).then((snapshot) => {

        if(snapshot.exists()){
            let preferences = [] //[user[dateMax, dateMin, price, [Tags], userId], user2[], ...]
            let users = snapToArray(snapshot)
            
            users.forEach(element => {
                let userPref = [        //array con los datos de cada usuario
                    element.dateMax,
                    element.dateMin,
                    element.price,
                    element.tags,
                    element.userId
                ]
                preferences.push(userPref)
            })
            getBestFilter(preferences, res)
        }


    })

}

function snapToArray(snapshot){
    var returnArr = []

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val()
        item.key = childSnapshot.key

        returnArr.push(item)
    })

    return returnArr
}

function getBestFilter(usersPreferences, res){
    let maxDates = []
    let minDates = []
    let prices = []
    let groupTags = []

    for (const filt in usersPreferences) {
        if(usersPreferences[filt][0] != "" && usersPreferences[filt][0] != undefined){
            maxDates.push(new Date(usersPreferences[filt][0]))
        }
        if(usersPreferences[filt][1] != "" && usersPreferences[filt][1] != undefined){
            minDates.push(new Date(usersPreferences[filt][1]))
        }
        if(usersPreferences[filt][2] != "" && usersPreferences[filt][2] != undefined){
            prices.push(parseFloat(usersPreferences[filt][2]))
        }
        if(usersPreferences[filt][3] != "" && usersPreferences[filt][3] != undefined){
            addNotExistingElement(usersPreferences[filt][3], groupTags)
        }
    }
    recommendToGroups(maxDates, minDates, prices, groupTags, res)
}

function addNotExistingElement(arr1, arr2) {
    try {
        arr1.forEach(element => {
            if(!arr2.includes(element)){
                arr2.push(element)
            }
        })
    } catch (error) {
      return "no se pudo encontrar"
    }
}

function recommendToGroups(groupMaxDates, groupMinDates, groupPrices, groupTags, res){
    get(child(rdbRef, `events/`)).then((eventSnapshot) => {
        if(eventSnapshot.exists()){
            let events = eventSnapshot.val()
            let foundEvents = []

            let maxStartDate = getMaxDate(groupMinDates)
            let minFinishDate = getMinDate(groupMaxDates)
            let minPrice = Math.min.apply(null, groupPrices)

            for (const evnt in events) {
                if(events[evnt] != undefined && findCommonElements(events[evnt].tags, groupTags) && events[evnt].private == false){
                    foundEvents.push(events[evnt])
                }
                else if(events[evnt] == undefined && events[evnt].private == false && groupTags == []){
                    foundEvents.push(events[evnt])
                }
                else if(events[evnt].tags != undefined && events[evnt].private == false && groupTags == []){
                    foundEvents.push(events[evnt])
                }
            }

            let result = filterWithSelected(maxStartDate, minFinishDate, minPrice, foundEvents)

            if(result.length > 0){
                returnEvents(res, result)
            }
        }
    })
}

function getMaxDate(arrDates){
    try{
        return new Date(Math.max.apply(null, arrDates))
    }
    catch(error){
        return "te jodes"
    }
}

function getMinDate(arrDates){
    try{
        return new Date(Math.min.apply(null, arrDates))
    }
    catch(error){
        return "te jodes pero menos"
    }
}

function findCommonElements(arr1, arr2) {
    try {
      return arr1.some(item => arr2.includes(item))
    } catch (error) {
      return "no se pudo encontrar"
    }
}

function filterWithSelected(maxSDate, minFDate, minPrice, eventList){
    let filteredEvents = []

    for (const key in eventList) {
        if(new Date(eventList[key].startDate) >= maxSDate && new Date(eventList[key].finishDate) <= minFDate && parseFloat(eventList[key].price) <= minPrice) {
            filteredEvents.push(eventList[key])            
        }
    }

    return filteredEvents
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