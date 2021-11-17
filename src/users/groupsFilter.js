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
                let joya = true
                returnEvents(res, result, joya)
            }
            else{
                let resultF = filterWithSelected(maxStartDate, getMinDate(extractMin(groupMinDates)), minPrice, foundEvents)
                let resultS = filterWithSelected(getMaxDate(extractMax(groupMaxDates)), minFinishDate, minPrice, foundEvents)
                let resultP = filterWithSelected(maxStartDate, minFinishDate, Math.min.apply(null, extractMin(groupPrices)), foundEvents)
                let joya = false
                let combinedRes = [resultS, resultF, resultP]
                returnEvents(res, combinedRes, joya)
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

function extractMax(arr){
    try{
        let index = arr.indexOf(Math.max.apply(null, arr))
        if(index > -1){
            arr.splice(index, 1)
            return arr
        }
         
    }
    catch(error){
        return "te jodes pero sin lo más grande"
    }
}

function extractMin(arr){
    try{
        let index = arr.indexOf(Math.min.apply(null, arr))
        
        if(index > -1){
            arr.splice(index, 1)
            return arr
        }
         
    }
    catch(error){
        return "te jodes pero sin lo más xikito"
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

async function returnEvents(res, events, todoJoya){
    try {
        if(todoJoya == true){
            let result = []
            for (let ev of events) {
                await replaceImagesWithURL_Event(ev)
            result.push(objectWithURLs)
            }
            let response = {"todo bien": todoJoya, "items":result}
            res.json(response)
        }
        else{
            let result = [[],[],[]]
            let i = 0
            for (let ev of events) {
                for (const key in ev) {
                    console.log()
                    await replaceImagesWithURL_Event(ev[key])
                    result[i].push(objectWithURLs)
                }
                i++
            }
            let response = {"todo bien": todoJoya, "items Sin Start Date":result[0], "items Sin Finish Date":result[1], "items Sin Precio":result[2]}
            res.json(response)
        }
    } catch (error) {
      return "no se pudo enviar, así que te jodes"
    }
  }