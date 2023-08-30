const path = require('path')
const express = require('express')
const vcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

//Local Imports
const member = require('./Source/member')
const broker = require('./Source/broker')
const venue = require('./Source/venue')

function home_page(req: express.Request, res: express.Response) {
    res.sendFile(utils.get_views_path("index.html"))
}

function login_page(req: express.Request, res: express.Response) {

    if (req.session.user !== undefined) {
        res.redirect("/dashboard")
    }

    res.set("Cache-Control", "no-store")
    res.sendFile(utils.get_views_path("login.html"))
}

/*function member_login_page(req: express.Request, res: express.Response) {

    if (req.session.user !== undefined) {
        res.redirect("/dashboard")
    }

    res.set("Cache-Control", "no-store")
    res.sendFile(utils.get_views_path("member-login.html"))
}

function venue_login_page(req: express.Request, res: express.Response) {

    if (req.session.user !== undefined) {
        res.redirect("/dashboard")
    }

    res.set("Cache-Control", "no-store")
    res.sendFile(utils.get_views_path("venue-login.html"))
}*/

async function login_form_submit(req: express.Request, res: express.Response) {

    try {
        let reqEmail    = req.body.email_address
        let reqPass     = req.body.password
        
        let isVenue = false

        let user : Member | Venue

        /*db.query(`SELECT email_address FROM ${user} where email_address = ?`, [reqEmail], (error, results, fields) => {

            if (error) throw error
            if (results.length > 0) {

                req.session.loggedin = true
                req.session.username = username

                res.redirect('/home')
            }
            else {
                res.send('Incorrect Username and/or Password!')
                res.redirect('/login')
            }
            response.end()
        })*/

        user = await db.Members_collection.findOne<Member>(
            {"email_address": reqEmail}
        )

        user = await db.Venues_collection.findOne<Venue>(
            {"email_address": reqEmail}
            isVenue = true
        )

        if (user === null) {
            res.redirect("/login")
            return;
        }

        const valid : boolean = await bcryptjs.compare(reqPass, user.password)

        if (valid) {
            log.info(`Successful login attempt [USER: ${user.email_address}]`)
            req.session.regenerate(function() {

                req.session.user    = user
                req.session.isVenue - isVenue
                res.redirect("/dashboard")

            })
        }
    }
}

function dashboard_page(req, res) {

    if (req.session.user === undefined) {
        res.redirect("/login")
        return;
    }

    if (req.session.isVenue) {
        res.sendFile(utils.get_views_path("venue-dashboard.html"))
    } else {
        res.sendFile(utils.get_views_path("dashboard.html"))
    }
}

function PasswordReset {
    const sendEmail = async (email, subject, text) => {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.HOST,
                service: proccess.env.SERVICE,
                port: 587,
                secure: true,
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS,
                },
            })
            await transporter.sendEmail({
                from: process.env.USER,
                to: email,
                subject: subject,
                text: text,
            })

            console.log("email sent successfully")
        } catch (error) {
            console.log(error, "email not sent")
        }
    }
}

