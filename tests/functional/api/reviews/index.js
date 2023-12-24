import chai from "chai";
import request from 'supertest';

const mongoose = require("mongoose");
import Review from "../../../../api/reviews/reviewModel";
import api from "../../../../index";

const expect = chai.expect;
let db;
let user1token;

describe("Review endpoint", () => {
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
            await Review.deleteMany();
            // Register two reviews
            await request(api).post("/api/users?action=register").send({
                username: "user1",
                password: "test123@",
                favouriteMovies: [11, 22, 33],
                toWatchMovies: [44, 55],
                favouriteActors: [112233, 223344]
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
})