import { child, get, ref, set, push, update } from '@firebase/database'
import { rdb } from '../index.js'

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
            getBestFilter(preferences)
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

function getBestFilter(usersPreferences){
    let maxDates = []
    let minDates = []
    let prices = []
    let groupTags = []

    for (const filt in usersPreferences) {
        if(usersPreferences[filt][0] != "" && usersPreferences[filt][0] != undefined){
            maxDates.push(usersPreferences[filt][0])
        }
        if(usersPreferences[filt][1] != "" && usersPreferences[filt][1] != undefined){
            minDates.push(usersPreferences[filt][1])
        }
        if(usersPreferences[filt][2] != "" && usersPreferences[filt][2] != undefined){
            prices.push(usersPreferences[filt][2])
        }
        if(usersPreferences[filt][3] != "" && usersPreferences[filt][3] != undefined){
            addNotExistingElement(usersPreferences[filt][3], groupTags)
        }
    }
    recommendToGroups(maxDates, minDates, prices, groupTags)
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

function recommendToGroups(groupMaxDates, groupMinDates, groupPrices, groupTags){
    get(child(rdbRef, `events/`)).then((eventSnapshot) => {
        if(eventSnapshot.exists()){
            let events = eventSnapshot.val()
            let foundEvents = []

            for (const evnt in events) {
                
            }
        }
    })
}