const request = require("supertest");
const { app } = require("../../server");

describe("Sign up Venue", () => {
    it("returns 201 on successful signup", async () => {
        return request(app)
            .post("/api/venues/signup")
            .send({
                name: "test",
                address: "test",
                email: "test@test.com",
                password: "password",
            })
            .expect(201);
    });

    it("returns 400 with invalid email", async () => {
        return request(app)
            .post("/api/venues/signup")
            .send({
                email: "alskdflaskjfd",
                password: "password",
            })
            .expect(400);
    });

    it("returns 400 with invalid password", async () => {
        return request(app)
            .post("/api/venues/signup")
            .send({
                email: "alskdflaskjfd",
                password: "p",
            })
            .expect(400);
    });

    it("returns 400 with missing email and password", async () => {
        await request(app)
            .post("/api/venues/signup")
            .send({
                email: "test@test.com",
            })
            .expect(400);

        await request(app)
            .post("/api/venues/signup")
            .send({
                password: "alskjdf",
            })
            .expect(400);
    });

    it("disallows duplicate emails", async () => {
        await request(app)
            .post("/api/venues/signup")
            .send({
                name: "test",
                email: "test@test.com",
                password: "password",
            })
            .expect(201);

        await request(app)
            .post("/api/venues/signup")
            .send({
                name: "test",
                email: "test@test.com",
                password: "password",
            })
            .expect(400);
    });

    it("sets a cookie after successful signup", async () => {
        const response = await request(app)
            .post("/api/venues/signup")
            .send({
                name: "test",
                email: "test@test.com",
                password: "password",
            })
            .expect(201);

        expect(response.get("Set-Cookie")).toBeDefined();
    });
});

describe("Sign in Venue", () => {
    it("fails when email that does not exist", async () => {
        await request(app)
            .post("/api/venues/signin")
            .send({
                email: "test@test.com",
                password: "password",
            })
            .expect(400);
    });

    it("fails when incorrect password", async () => {
        await request(app)
            .post("/api/venues/signup")
            .send({
                name: "test",
                email: "test@test.com",
                password: "password",
            })
            .expect(201);

        await request(app)
            .post("/api/venues/signin")
            .send({
                email: "test@test.com",
                password: "aslkdfjalskdfj",
            })
            .expect(400);
    });

    it("responds with cookie when valid credentials", async () => {
        await request(app)
            .post("/api/venues/signup")
            .send({
                name: "test",
                email: "test@test.com",
                password: "password",
            })
            .expect(201);

        const response = await request(app)
            .post("/api/venues/signin")
            .send({
                email: "test@test.com",
                password: "password",
            })
            .expect(200);

        expect(response.get("Set-Cookie")).toBeDefined();
    });
});

describe("Sign out Venue", () => {
    it("clears cookie after sign out", async () => {
        await request(app)
            .post("/api/venues/signup")
            .send({
                email: "test@test.com",
                password: "password",
            })
            .expect(201);

        const response = await request(app)
            .post("/api/venues/signout")
            .send({})
            .expect(200);

        expect(response.get("Set-Cookie")[0]).toEqual(
            "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
        );
    });
});
