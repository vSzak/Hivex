"use strict";
class Member {

    id = Number
    first_name = String
    last_name = String
    email_address = String
    password = String
    isBroker = Boolean

    constructor(id, first_name, last_name, email_address, password, isBroker) {
        this.id = id
        this.first_name = first_name
        this.last_name = last_name
        this.email_address = email_address
        this.password = password
        this.broker = isBroker
    }
}

module.exports = Member