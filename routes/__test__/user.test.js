const request = require("supertest");
const { app } = require("../../server");

describe("Sign up", () => {
    it("returns 201 on successful signup", async () => {
        return request(app)
            .post("/api/members/signup")
            .send({
                firstName: "test",
                lastName: "quan",
                email: "test@test.com",
                password: "password",
            })
            .expect(201);
    });

    it("returns 201 on successful broker signup", async () => {
        const response = await request(app)
            .post("/api/brokers/signup")
            .send({
                firstName: "test",
                lastName: "quan",
                email: "test@test.com",
                password: "password",
            })
            .expect(201);
        expect(response.body.isBroker).toEqual(true);
    });

    it("returns 400 with invalid email", async () => {
        return request(app)
            .post("/api/members/signup")
            .send({
                email: "alskdflaskjfd",
                password: "password",
            })
            .expect(400);
    });

    it("returns 400 with invalid password", async () => {
        return request(app)
            .post("/api/members/signup")
            .send({
                email: "alskdflaskjfd",
                password: "p",
            })
            .expect(400);
    });

    it("returns 400 with missing email and password", async () => {
        await request(app)
            .post("/api/members/signup")
            .send({
                email: "test@test.com",
            })
            .expect(400);

        await request(app)
            .post("/api/members/signup")
            .send({
                password: "alskjdf",
            })
            .expect(400);
    });

    it("disallows duplicate emails", async () => {
        await request(app)
            .post("/api/members/signup")
            .send({
                email: "test@test.com",
                password: "password",
            })
            .expect(201);

        await request(app)
            .post("/api/members/signup")
            .send({
                email: "test@test.com",
                password: "password",
            })
            .expect(400);
    });

    it("sets a cookie after successful signup", async () => {
        const response = await request(app)
            .post("/api/members/signup")
            .send({
                email: "test@test.com",
                password: "password",
            })
            .expect(201);

        expect(response.get("Set-Cookie")).toBeDefined();
    });
});

describe("Sign in", () => {
    it("returns 201 on successful signup", async () => {
        return request(app)
            .post("/api/members/signup")
            .send({
                email: "test@test.com",
                password: "password",
            })
            .expect(201);
    });
});
