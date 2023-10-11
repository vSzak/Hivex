const {Client, Environment, ApiError} = require("square")

const client = new Client({
    accesstoken: process.env.SQUARE_ACCESS_TOKEN,
    environment: Environment.Sandbox,
})

const {locationsApi} = client