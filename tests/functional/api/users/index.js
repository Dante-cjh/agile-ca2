import chai from "chai";
import request from "supertest";

const mongoose = require("mongoose");
import User from "../../../../api/users/userModel";
import api from "../../../../index";

const expect = chai.expect;
let db;
let user1token;

describe("Users endpoint", () => {
    before(() => {
        mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        db = mongoose.connection;
    });

    after(async () => {
        try {
            await db.dropDatabase();
        } catch (error) {
            console.log(error);
        }
    });
    beforeEach(async () => {
        try {
            await User.deleteMany();
            // Register two users
            await request(api).post("/api/users?action=register").send({
                username: "user1",
                password: "test123@",
                favouriteMovies: [11, 22, 33],
                toWatchMovies: [44],
                favouriteActors: [11223]
            });
            await request(api).post("/api/users?action=register").send({
                username: "user2",
                password: "test123@",
            });
        } catch (err) {
            console.error(`failed to Load user test Data: ${err}`);
        }
    });
    afterEach(() => {
        api.close();
    });
    describe("GET /api/users ", () => {
        it("should return the 2 users and a status 200", (done) => {
            request(api)
                .get("/api/users")
                .set("Accept", "application/json")
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.equal(2);
                    let result = res.body.map((user) => user.username);
                    expect(result).to.have.members(["user1", "user2"]);
                    done();
                });
        });
    });

    describe("POST /api/users ", () => {
        describe("For a register action", () => {
            describe("when the payload is correct", () => {
                it("should return a 201 status and the confirmation message", () => {
                    return request(api)
                        .post("/api/users?action=register")
                        .send({
                            username: "user3",
                            password: "test123@",
                        })
                        .expect(201)
                        .expect({msg: "User successfully created.", success: true});
                });
                after(() => {
                    return request(api)
                        .get("/api/users")
                        .set("Accept", "application/json")
                        .expect(200)
                        .then((res) => {
                            expect(res.body.length).to.equal(3);
                            const result = res.body.map((user) => user.username);
                            expect(result).to.have.members(["user1", "user2", "user3"]);
                        });
                });
            });
        });
        describe("For an authenticate action", () => {
            describe("when the payload is correct", () => {
                it("should return a 200 status and a generated token", () => {
                    return request(api)
                        .post("/api/users?action=authenticate")
                        .send({
                            username: "user1",
                            password: "test123@",
                        })
                        .expect(200)
                        .then((res) => {
                            expect(res.body.success).to.be.true;
                            expect(res.body.token).to.not.be.undefined;
                            user1token = res.body.token.substring(7);
                        });
                });
            });
        });
    });

    describe('User Relevant Movies API Tests', () => {
        before((done) => {
            request(api)
                .post('/api/users?action=authenticate')
                .send({
                    username: 'user1',
                    password: 'test123@',
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body.success).to.be.true;
                    expect(res.body.token).to.not.be.undefined;
                    user1token = res.body.token.substring(7);
                    done();
                });
        });
        describe('GET /api/user/relevant/movies', () => {
            it('should return favourite movies for an authenticated user', async () => {
                console.info(user1token);
                const res = await request(api)
                    .get('/api/user/relevant/movies')
                    .set('Authorization', `BEARER ${user1token}`)
                    .expect(200);
                expect(res.body.favouriteMovies).to.be.a('array');
                expect(res.body.favouriteMovies.length).equal(3);
            });

            it('should deny access for unauthenticated requests', async () => {
                await request(api)
                    .get('/api/user/relevant/movies')
                    .expect(500);
            });
        });
        describe('POST /movies API Tests', () => {
            describe("When the token is correct", () => {
                it('should successfully add a favourite movie for an authenticated user', async () => {
                    await request(api)
                        .post('/api/user/relevant/movies')
                        .set('Authorization', `Bearer ${user1token}`)
                        .send({movieId: 789})
                        .expect(200)
                        .then(res => {
                            expect(res.body.message).to.equal('Favourite movie added successfully');
                        });
                });
                after(() => {
                    return request(api)
                        .get("/api/user/relevant/movies")
                        .set('Authorization', `BEARER ${user1token}`)
                        .expect(200)
                        .then((res) => {
                            expect(res.body.favouriteMovies).to.be.a('array');
                            expect(res.body.favouriteMovies.length).equal(4);
                            const result = res.body.favouriteMovies.map((id) => id);
                            expect(result).to.have.members([11, 22, 33, 789]);
                        });
                });
            });
            describe("When the token is wrong", () => {
                it('should deny access for unauthenticated requests', async () => {
                    await request(api)
                        .post('/api/user/relevant/movies')
                        .send({movieId: '123'})
                        .expect(500);
                });
            })
        });

        describe('DELETE /api/user/relevant/movies', () => {
            describe("When user is authenticate" ,() => {
                it('should successfully remove a favourite movie for an authenticated user', async () => {
                    await request(api)
                        .delete('/api/user/relevant/movies')
                        .set('Authorization', `Bearer ${user1token}`)
                        .send({ movieId: 11 }) // Adjust the movieId as necessary
                        .expect(200)
                        .then(res => {
                            expect(res.body.message).to.equal('Favourite movie removed successfully');
                        });
                });
                after(() => {
                    return request(api)
                        .get("/api/user/relevant/movies")
                        .set('Authorization', `BEARER ${user1token}`)
                        .expect(200)
                        .then((res) => {
                            expect(res.body.favouriteMovies).to.be.a('array');
                            expect(res.body.favouriteMovies.length).equal(2);
                            const result = res.body.favouriteMovies.map((id) => id);
                            expect(result).to.have.members([22, 33]);
                        });
                });
            });

            describe("When use is not authenticate", () => {
                it('should deny access for unauthenticated requests', async () => {
                    await request(api)
                        .delete('/api/user/relevant/movies')
                        .send({ movieId: '123' })
                        .expect(500);
                });
            })

        });
    });
});
