const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { app } = require("../server");
const request = require("supertest");

// global.signin = async () => {
//     const email = "test@test.com";
//     const password = "password";

//     // Sign up new user
//     const response = await request(app)
//         .post("/api/users")
//         .send({
//             name: "test",
//             email,
//             phone: "123",
//             password,
//         })
//         .expect(201);

//     const cookie = response.get("Set-Cookie");

//     return cookie;
// };

let mongo;

beforeAll(async () => {
    process.env.JWT_KEY = "123";
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    mongoose.set('strictQuery', true); 
    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});
