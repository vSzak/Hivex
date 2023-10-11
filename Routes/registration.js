"use strict"
const bcryptjs = require("bcryptjs")
const db = require("../Source/db-client")
const Member = require("../Source/member")
const path = require("path")

function registerPage (req, res) {
    if (req.session.user !== undefined) {
        res.redirect("/dashboard")
        return
    }

    res.sendFile(utils.get_views_path("register.js"))
}

// Password minimum rules
async function registerFormSubmit(req, res) {
  try {
    // Validate the password
    req.check('password').matches(
        /^(?=.*[A-Za-z])(?=.*[#$@!%&*?])(?=.*\d)[A-Za-z#$@!%&*?0-9]{8,}$/,
         'i');

    // Check if the email already exists in the database
    const documentCount = await db.member_collection.countDocuments({
      email: req.body.email,
    });

    if (documentCount === 0) {
      // Hash the password
      const hash = await bcryptjs.hash(req.body.password, 10);

      // Create a new Member instance
      const member = new Member(
        req.body.id,
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        hash,
        false
      );

      // Insert the member into the database
      const result = await db.member_collection.insertOne(member);

      if (result) {
        log.info(`User Successfully added [USER: ${member.email_address}]`);
        res.redirect('/login');
      } else {
        log.error('Failed to create user');
        res.redirect('/register');
      }
    } else {
      // Handle the case where the email already exists
      res.status(400).send('Email already exists');
    }
  } catch (error) {
    // Handle errors here
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
    registerFormSubmit,
    registerPage
}