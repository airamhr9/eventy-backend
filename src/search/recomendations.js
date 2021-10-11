import { child, get, ref } from '@firebase/database'
import { rdb } from '../index.js'
import { getUserPreferences } from '../users/userPreferences.js'
import { getUser } from '../users/userProfile.js'

const rdbRef = ref(rdb)

export function recomend(res, userId){
    let userPref = getUserPreferences(res, userId)
    let user = getUser(res, userId)
    let result = []

    get(child(rdbRef, `events/`)).then((snapshot) => {
        if(snapshot.exists()){
            let events = snapshot.val()

            events.forEach(element => {
                if(findCommonElements(element.tags, userPref)){
                    result.push(element)
                }
            })
        }
        sortByLocation(result, user)
        returnRecomendations(res, result)
    })
}

function findCommonElements(arr1, arr2) {
    try {
      return arr1.some(item => arr2.includes(item))
    } catch (error) {
      return "no se pudo encontrar"
    }
}

function sortByLocation(events, userLocation){
    try {
        let [latU, longU] = userLocation.location.split(", ")

        for(let i = 0; i < events.length; i++){
            let [latE, longE] = events[i].location.split(", ")
            let dist = distance(parseInt(latU), parseInt(longU), latE, longE)

            events[i].distance = dist
        }

        events.sort(function(a, b){
            return a.distance - b.distance
        })

        console.log(events)
    } catch (error) {
        "no se pudo ordenar"
    }

}

function distance(lat1, long1, lat2, long2, unit){
    if((lat1 = lat2) && (long1 = long2)){
        return 0
    }
    else{
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
}

function returnRecomendations(res, result){
    try {
        res.send(result)
      } catch (error) {
        return "no se pudo enviar"
      }
}