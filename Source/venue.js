"use strict"
class Venue {
    constructor(id, venue_name, address, email_address, password) {
        this.id             = id;
        this.venue_name     = venue_name;
        this.address      = address;
        this.email_address  = email_address;
        this.password       = password;
    }
}

module.exports = Venue