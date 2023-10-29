"use strict";

// Import the bcryptjs library for hashing and verifying passwords
const bcryptjs = require("bcryptjs");

// Import the "db-client" module from the "../Source" directory
const db = require("../Source/db-client");

// Import the "member" module from the "../Source" directory
const Member = require("../Source/member");

// Import the "venue" module from the "../Source" directory
const Venue = require("../Source/venue");

// Import the "listFilesAbsolute" function from the "@nlpjs/basic" module
const { listFilesAbsolute } = require("@nlpjs/basic");

// Import the "path" module
const path = require("path");

// Import the 'utils' module from the "../Source" directory
const utils = require("../Source/utils");

// Function to render the dashboard page
function dashboard_page(req, res) {

  // Check if the user is not logged in
  if (req.session.user === undefined) {
    // Redirect the user to the "/login" page if not logged in
    res.redirect("/login");
    return;
  }

  // Check if the user is a venue
  if (req.session.isVenue) {
    // Send the "venue-dashboard.html" file as a response
    res.sendFile(utils.get_views_path("venue-dashboard.html"));
  } else {
    // Send the "dashboard.html" file as a response
    res.sendFile(utils.get_views_path("dashboard.html"));
  }
}

// Function to toggle the broker dashboard visibility
function brokerDashboard() {
  // Initialize a variable to track if the broker dashboard is visible
  let isBroker = false;

  // Get the HTML element with the id "BrokerButton"
  var x = document.getElementById("BrokerButton");

  // Toggle the visibility of the broker dashboard
  if (isBroker) {
    // If the broker dashboard is visible, hide it
    x.style.display = "none";
    isBroker = false;
  } else {
    // If the broker dashboard is not visible, show it
    x.style.display = "block";
    isBroker = true;
  }
}

// Hash a password before storing it in the database
async function hashPassword(password) {
  try {
    // Define the number of salt rounds for password hashing
    const saltRounds = 10; // You can adjust the number of salt rounds

    // Use bcryptjs to hash the password with the specified salt rounds
    const hash = await bcryptjs.hash(password, saltRounds);

    // Return the hashed password
    return hash;
  } catch (error) {
    // Handle any errors that occur during hashing
    throw error;
  }
}

// Verify a password during login
async function verifyPassword(plainTextPassword, hashedPassword) {
  try {
    // Use bcryptjs to compare the plain text password with the hashed password
    return await bcryptjs.compare(plainTextPassword, hashedPassword);
  } catch (error) {
    // Handle any errors that occur during password verification
    throw error;
  }
}

// Export the functions to be used in other parts of the application
module.exports = {
  dashboard_page,
  brokerDashboard,
  hashPassword,
  verifyPassword,
};
