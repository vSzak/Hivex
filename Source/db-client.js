"use strict"

const mongodb = require("mongodb")

const db_client = new mongodb.MongoClient(process.env.mongodb)
const hivex_db = db_client.db("hivex-db")
const members_collection = hivex_db.collection("Members")
const brokers_collection = hivex_db.collection("Brokers")
const venues_collection = hivex_db.collection("Venues")
const coupons_collection = hivex_db.collection("Coupons")

module.exports = {
    db_client,
    members_collection,
    brokers_collection,
    venues_collection,
    coupons_collection
}