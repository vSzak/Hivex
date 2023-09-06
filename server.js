const express = require('express')
const app = express()
require('dotenv').config()
const {MongoClient} = require("mongodb")

const port = 3000

const mongooseDB = require('./database/config')

// Local Imports
//const db = require("./Source/db-client")
const home = require("./Routes/home")
const dashboard = require("./Routes/dashboard")
const loginForm = require("./Routes/loginForm")
const passwordReset = require("./Routes/passwordReset")
const registration = require("./Routes/registration")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

// Enable stativ file serving
app.use("/stylesheets", express.static("public/stylesheets"))
app.use("/scripts", express.static("public/scripts"))
app.use("/icons", express.static("public/icons"))
app.use("/assets", express.static("public/assets"))

//ROUTES
// Home Page
app.get("/", home.homePage)
// Login Page
app.get("/login", loginForm.loginPage)
app.post("/login", loginForm.loginFormSubmit)

// Dashboard Pages and Similar
app.get("/dashbaord", dashboard.dashboard_page)

// Logout
app.get("/logout", loginForm.logout)

//Register
app.get("/register", registration.registerPage)
app.post("/register", registration.registerFormSubmit)


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

mongooseDB.open()

function shutdown () {
    console.log("\nSIGTERM received, shutting down...")
    mongooseDB.close()
    server.close(() => {
        console.log("=== Server closed ===")
    })
}

process.on("SIGTERM", shutdown)
process.on("SIGINT", shutdown)