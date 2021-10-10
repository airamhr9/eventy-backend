import express from 'express'

import { getTags } from './tags.js'
import { getUserPreferences, setUserPreferences } from './users/userPreferences.js'

export const app = express()
const port = process.argv[2] || 8000

app.use(express.json())

app.get('/tags', (req, res) => {
    getTags(res)
})

app.get('/users', (req, res) => {
    if (req.query.preferences == 'true') { // No borrar el " == 'true' "
        getUserPreferences(res, req.query.id)
    } else {
        res.send('Not supported')
    }
})

app.post('/users', (req, res) => {
    if (req.query.preferences == 'true') { // No borrar el " == 'true' "
        setUserPreferences(req.query.id, req.body)
        res.send()
    } else {
        res.send('Not supported')
    }
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})