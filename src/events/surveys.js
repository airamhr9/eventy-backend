import { child, get, ref, update, push, set } from '@firebase/database'
import { rdb } from '../index.js'

const rdbRef = ref(rdb)

export function sendSurvey(eventId, surveyId, userId, res) {
    get(child(rdbRef, `events/${eventId}/surveys/${surveyId}`)).then(snapshot => {
        let survey = snapshot.val()
        for (let option of survey.options) {
            if (option.votes == undefined) {
                option.votes = []
            }
        }
        survey.userHasVoted = userHasVoted(survey, userId)
        res.send(survey)
    })
}

function userHasVoted(survey, userId) {
    for (let option of survey.options) {
        for (let user of option.votes) {
            if (user == userId) {
                return true
            }
        }
    }
    return false
}

export function addSurveyToEvent(eventId, surveyData) {
    let path = `events/${eventId}/surveys`
    let newSurveyId = push(child(rdbRef, path)).key
    path += `/${newSurveyId}`

    let objectToPost = {
        id: newSurveyId,
        numVotes: 0,
        question: surveyData.question,
        options: []
    }
    surveyData.options.forEach(option => {
        objectToPost.options.push({
            text: option,
            votes: [],
            percentage: 0.0
        })
    })

    set(ref(rdb, path), objectToPost)
}

export function vote(eventId, surveyId, userId, option) {
    let path = `events/${eventId}/surveys/${surveyId}`
    get(child(rdbRef, path)).then(snapshot => {
        let survey = snapshot.val()
        survey.numVotes++
        
        let optionObject = survey.options[getIndexOfOption(survey, option)]
        if (optionObject.votes == undefined) {
            optionObject.votes = []
        }
        optionObject.votes.push(userId)

        for (let opt of survey.options) {
            if (opt.votes == undefined) {
                opt.votes = []
            }
            opt.percentage = percentageOfOption(opt.votes.length, survey.numVotes)
        }

        update(child(rdbRef, path), survey)
    })
}

function getIndexOfOption(survey, option) {
    for (let i = 0; i < survey.options.length; i++) {
        if (survey.options[i].text == option) {
            return i
        }
    }
    return -1
}

function percentageOfOption(optionVotes, totalVotes) {
    return optionVotes / totalVotes * 100
}