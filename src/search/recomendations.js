import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'
import { replaceImagesWithURL_Event, objectWithURLs } from '../images.js'

const rdbRef = ref(rdb)

export function recomend(res, user, latitude, longitude, page){
    get(child(rdbRef, `events/`)).then((snapshot) => {
        if(snapshot.exists()){
            let result = []
            let events = snapshot.val()
            let pref = user.preferences
            events.forEach(element => {
                if (element.participants == undefined) {
                    element.participants = []
                }
                if (element.possiblyParticipants == undefined) {
                    element.possiblyParticipants = []
                }
                
                if(findCommonElements(element.tags, pref) && element.private == false && element.community == null){
                    if(new Date(element.finishDate) >= new Date(Date.now())){
                        if(element.participants.includes(user.id) == false && element.possiblyParticipants.includes(user.id) == false){
                            result.push(element)
                        }
                    }
                }                
            })
            
            if(result.length == 0){
                for(var i = 0; i<events.length;i++){
                    if(events[i].private == false){
                        if(new Date(events[i].finishDate) >= new Date(Date.now())){
                            if(events[i].participants.includes(user.id) == false && events[i].possiblyParticipants.includes(user.id) == false){
                                result.push(events[i])
                            }
                        }
                    }
                }
            }
            sortByLocation(result, latitude, longitude, res, page)
        }
        
    })
}

function findCommonElements(arr1, arr2) {
    try {
      return arr1.some(item => arr2.includes(item))
    } catch (error) {
      return "no se pudo encontrar"
    }
}

function sortByLocation(events, lat, lon, res, page){
    try {

        events.forEach(element => {
            var latE = element.latitude
            var longE = element.longitude
            var dist = distance(parseFloat(lat), parseFloat(lon), latE, longE, "K")
            element.distance = dist.toFixed(2)
        })

        events.sort(function(a, b){
            return parseFloat(a.distance) - parseFloat(b.distance)
        })
        emptyList(events)

        returnRecomendations(res, events, page)
    } catch (error) {
        return "xd"
    }
}

function distance(lat1, long1, lat2, long2, unit){
    
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = long1 - long2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    if(dist > 1){
        dist = 1
    }
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") {dist = dist * 1.609344}

    return dist
    
}

function emptyList(events){
    events.forEach(element => {
        if(element.participants == null){
            element.participants = []
        }
    })
}

function makeJSON(page, result){
    var pagedEvents
    if(page == null){
        if(result.length<20){
            pagedEvents = result.slice(0, result.length-1)
        }
        pagedEvents = result.slice(0,19)
    }
    else{
        if(result.length<(page*10)+20){
            pagedEvents = result.slice(page*10, result.length-1)
        }
        pagedEvents = result.slice(page*10, (page*10)+19)
    }
    return pagedEvents
}

async function returnRecomendations(res, events, page){
    try {
        let result = []
        for (let ev of events) {
            await replaceImagesWithURL_Event(ev)
            result.push(objectWithURLs)
        }
        var pagedResult = makeJSON(page, result)
        var response = {"count": pagedResult.length, "items":pagedResult}
        res.json(response)
    } catch (error) {
        return "no se pudo enviar"
    }
}