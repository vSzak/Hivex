const express = require('express')
const app = express()

const port = process.env.PORT || 3000

const mongooseDB = require('./database/config')

app.use(express.json())
app.use(express.urlencoded({extended:false}))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.listen(port, () => {

    console.log(`listening on port ${port}`)
})

mongooseDB.open()