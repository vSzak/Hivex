const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const { app } = require("../server");
const request = require("supertest");

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

global.signin = async () => {
    const email = "test@test.com";
    const password = "password";

    // Sign up
    const response = await request(app)
        .post("/api/members/signup")
        .send({
            firstName: "test",
            lasttName: "test",
            email: "test@test.com",
            password: "password",
        })
        .expect(201);

    const cookie = response.get("Set-Cookie");

    return cookie;
};