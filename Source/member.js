"use strict";
class Member {
    constructor(id, first_name, last_name, email_address, password) {
        this.id = id
        this.first_name = first_name
        this.last_name = last_name
        this.email_address = email_address
        this.password = password
    }
}

module.exports = Member