//Third Party Import
import mongodb = require("mongodb");

//Local Imports
import Member = require("./member");
import Broker = require("./broker");
import Venue = require("./venue");
import Coupon = require("./coupon");


const db_client         : mongodb.MongoClient           = new mongodb.MongoClient("mongodb+srv://HivexAdmin:<oJ7AXlV6jJ5IjMXm>@hivex.cs6oby3.mongodb.net/");

const hivex_db          : mongodb.Db                    = db_client.db("HiveX-db");
const member_collection : mongodb.Collection<Member>    = hivex_db.collection("Members");
const broker_collection : mongodb.Collection<Broker>    = hivex_db.collection("Brokers");
const venue_collection : mongodb.Collection<Venue>    = hivex_db.collection("Venues");
const coupon_collection : mongodb.Collection<Coupon>    = hivex_db.collection("Coupons");

export = {
    db_client,
    member_collection,
    broker_collection,
    venue_collection,
    coupon_collection
};