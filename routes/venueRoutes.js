const { validateRequest, BadRequestError } = require("@dqticket/common");
const express = require("express");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");

const MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://HivexAdmin:compasswtf@hivex.cs6oby3.mongodb.net/admin?authSource=admin&replicaSet=atlas-vryqyi-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"; //Connection String
const client = new MongoClient(url);
const dbName = 'HiveX-db';

const asyncHandler = require("../middleware/asyncHandler");
const { currentVenue } = require("../middleware/current-venue");
const Venue = require("../models/venueModel");

const router = express.Router();

// Sign up
// POST /api/venues/signup
router.post(
    "/signup",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .isLength({ min: 3, max: 20 })
            .withMessage("Password must be between 3 and 20 characters"),
    ],
    validateRequest,
    asyncHandler(async (req, res) => {
        const { name, address, email, password } = req.body;
        const existingVenue = await Venue.findOne({ email });

        if (existingVenue) {
            console.log("Email in use");
            throw new BadRequestError("Email in use");
        }

        const venue = await Venue.create({
            name,
            address,
            email,
            password,
        });
        await venue.save();

        // Generate JWT
        const venueJwt = jwt.sign(
            { id: venue.id, email: venue.email },
            process.env.JWT_KEY
        );

        // Store it on session object
        req.session = {
            jwt: venueJwt,
        };

        res.status(201).send(venue);
    })
);

// Sign in
// POST /api/venues/signin
router.post(
    "/signin",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must supply a password"),
    ],
    validateRequest,
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const existingVenue = await Venue.findOne({ email });
        if (!existingVenue) {
            throw new BadRequestError("Invalid credentials");
        }

        const passwordsMatch = await existingVenue.matchPassword(password);

        if (!passwordsMatch) {
            throw new BadRequestError("Invalid credentials");
        }

        // Generate JWT
        const venueJwt = jwt.sign(
            {
                id: existingVenue.id,
                email: existingVenue.email,
            },
            process.env.JWT_KEY
        );

        // Store it on session object
        req.session = {
            jwt: venueJwt,
        };

        res.status(200).send(existingVenue);
    })
);

// Sign out
// POST /api/venues/signout
router.post("/signout", (req, res) => {
    req.session = null;

    res.send({});
});

// Current user
// GET /api/venues/profile
router.get("/profile", currentVenue, (req, res) => {
    res.send({ currentVenue: req.currentVenue || null });
});

// Search Venues
// POST /api/venues/search
router.post('/search', function(req, res, next){

    MongoClient.connect(url, function(err, client){ //Connecting to Mongodb
  
      assert.equal(null, err); //Used to compare data and throw exceptions if data does not match. Used for development purposes only
  
      const db = client.db(dbName);
  
      var cursor = db.collection('Venues').find({ venue_name: new RegExp(req.body.search, 'i') });
  
      //Looping through the documents in the database to store into local array
      cursor.forEach(function(doc, err) {
        assert.equal(null, err);
        searchResults.push(doc); //storing to local array
      }, function(){
        client.close(); //closing database
        searchstat = true;
        //res.json(resultArray);
        res.redirect("/venues");
      });
  
    });
  
  });
  
// Get Venues
// GET /api/venues/get-venues
router.get('/get-venues', function(req, res, next){

    var resultArray = []; //Used to store all the data into a local array
  
    MongoClient.connect(url, function(err, client){ //Connecting to Mongodb
  
      assert.equal(null, err); //Used to compare data and throw exceptions if data does not match. Used for development purposes only
  
      const db = client.db(dbName);
  
      var cursor = db.collection('Venues').find();
  
      //Looping through the documents in the database to store into local array
      cursor.forEach(function(doc, err) {
        assert.equal(null, err);
        resultArray.push(doc.venue_name); //storing to local array
      }, function(){
        client.close(); //closing database
        res.json(resultArray);
      });
    });
});  

// Add Venue
//Post /api/venues/add-venue 
router.post('/add-venue', function(req, res, next) {

    var item = {
      venue_id: req.body.venue_id,
      venue_name: req.body.venue_name,
      venue_address: req.body.venue_address,
      venue_email: req.body.venue_email
    }
  
    //Access the database
    MongoClient.connect(url, function(err, client){
      assert.equal(null, err); //Used to compare data and throw exceptions if data does not match. Used for development purposes only
  
      const db = client.db(dbName);
      var docCount;
  
      db.collection("Venues").countDocuments({ venue_id: req.body.venue_id }, limit=1)
          .then(function(numItems) {
            console.log('numItems',numItems); // Use this to debug
            docCount = numItems;
  
            //If statement to check if the venue already exists
            if( docCount == 0 ){
              //Mongodb Insert function
              db.collection('Venues').insertOne(item, function(err, result){
                assert.equal(null, err);
                console.log('Venue inserted'); //logs on console on successful insertion
                
                client.close(); //closing database
                
                req.Venue = item;
                res.redirect('/venues');
  
              });
            }
            else{
              signErrMsg = true;
            }
          })
    });
  
  });

router.post('/edit-venues', function(req, res, next) {
    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
      if (err) throw err;
      const db = client.db(dbName);
      var myquery = {venue_id: req.body.venue_id};
      var newvalues = { $set: {
        venue_name: req.body.venue_name,
          venue_address: req.body.venue_address,
          venue_email: req.body.venue_name
        }
      }
  
  
      db.collection('Venues').updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
  
        client.close();
      });
    });
  
    res.redirect('/venues');
  });

  router.post('/remove-venues', function(req, res , next) {
    MongoClient.connect(url, {useUnifiedTopology: true}, function(err, client) {
      if (err) throw err;
      const db = client.db(dbName);
      var myquery = {venue_id: req.body.venue_id};
      
      db.collection('Venues').deleteOne(myquery, function(err, res) {
        if (err) throw err;
        console.log("1 document Deleted");
  
        client.close();
      });
    });
    res.redirect('/venues');
  });

module.exports = router;
