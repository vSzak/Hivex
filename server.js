const express = require('express')
const app = express()
require('dotenv').config()

const port = process.env.PORT || 3000

const mongooseDB = require('./database/config')

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

mongooseDB.open()