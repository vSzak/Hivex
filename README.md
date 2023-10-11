# Hivex
SDS Spring 23 Hivex Back-end Project
Tech Stack:
- Node.js
- MongoDB
- Express

# .env files
```js
MONGODB_URI = "mongodb+srv://HivexAdmin:compasswtf@hivex.cs6oby3.mongodb.net/"
HOST = // email HOST
USER = // email id
PASS = //email password
SERVICE = // email service
BASE_URL = "http://localhost:3000/api"
```

# Base URL
https://hivex.vercel.app

# Usage
```
GET /api

Sign up (member)
Access Public
POST /api/members/signup
Body {
  firstName,
  lastName,
  email,
  password
}

Sign up (broker)
Access Public
POST /api/brokers/signup
Body {
  firstName,
  lastName,
  email,
  password
}

Sign up (Venue)
Access Public
POST /api/venues/signup
Body {
  name,
  email,
  password
}

Sign in (member & broker)
Access Public
POST /api/members/signin
Body {
  email,
  password
}

Sign in (Venue)
Access Public
POST /api/venues/signin
Body {
  email,
  password
}

Get current member
Access Member
GET /api/members/profile

Sign out (member & broker)
POST /api/members/signout

Sign our (venues)
POST /api/venues/signout


Create coupon
Access Venue
POST /api/coupons
Body {
  title,
  code,
  value
}

Get all coupons created by a venue
Access Venue
GET /api/coupons

Get single coupons
Access public
GET /api/coupons/:id
(example) -> https://hivex.vercel.app/api/coupons/650530839a2c8d2a2aac75f8
```