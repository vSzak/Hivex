const mongoose = require('mongoose')

const url = 'mongodb+srv://HivexAdmin:compasswtf@hivex.cs6oby3.mongodb.net/'

const open = (uri = url) => {

    return new Promise((resolve, reject) => {

        mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, err =>{
            if (err) return reject(err)
            console.log('connected to db!')
        resolve()
        })
    })
}

const close = () => mongoose.disconnect()

module.exports = {open, close}