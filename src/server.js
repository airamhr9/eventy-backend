import express from 'express'
import { search } from './search/search.js'

import { getTags } from './tags.js'
import { getUserPreferences, setUserPreferences } from './users/userPreferences.js'
import { getUser, updateUser } from './users/userProfile.js'

const app = express()
const port = process.argv[2] || 8000

app.use(express.json())

app.get('/tags', (req, res) => {
    getTags(res)
})

app.get('/events', (req, res) =>{
    search("de", ["Museos"], res)
})

app.get('/users', (req, res) => {
    if (req.query.preferences == 'true') { // No borrar el " == 'true' "
        getUserPreferences(res, req.query.id)
    } else {
        getUser(res, req.query.id)
    }
})

app.post('/users', (req, res) => {
    if (req.query.preferences == 'true') { // No borrar el " == 'true' "
        setUserPreferences(req.query.id, req.body)
        res.send()
    } else {
        updateUser(req.body)
        res.send()
    }
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})