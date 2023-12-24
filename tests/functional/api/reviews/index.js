import chai from "chai";
import request from 'supertest';

const mongoose = require("mongoose");
import Review from "../../../../api/reviews/reviewModel";
import api from "../../../../index";
import User from "../../../../api/users/userModel";

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
        // Register user
        await request(api).post("/api/users?action=register").send({
            username: "user1",
            password: "test123@",
            favouriteMovies: [11, 22, 33],
            toWatchMovies: [44, 55],
            favouriteActors: [112233, 223344]
        });

        // Authenticate user
        let res = await request(api)
            .post('/api/users?action=authenticate')
            .send({
                username: 'user1',
                password: 'test123@',
            })
            .expect(200);
        expect(res.body.success).to.be.true;
        expect(res.body.token).to.not.be.undefined;
        user1token = res.body.token.substring(7);
        try {
            await Review.deleteMany();
            // Register two reviews
            await request(api).post("/api/reviews/review")
                .set('Authorization', `Bearer ${user1token}`)
                .send({
                id: 998877,
                movieId: 11,
                content: "I found the love. For me~~. I love it!",
                rating: "5"
            });
            console.log("add 1 success")
            await request(api).post("/api/reviews/review")
                .set('Authorization', `Bearer ${user1token}`)
                .send({
                id: 887766,
                movieId: 22,
                content: "I don't like it. It is not good.",
                rating: "1"
            });
        } catch (err) {
            console.error(`failed to Load user test Data: ${err}`);
        }
    });
    afterEach(() => {
        api.close();
    });
    describe("GET /api/reviews/:movieId", () => {
        it('should retrieve reviews for a valid movieId', async () => {
            const movieId = 11;
            await request(api)
                .get(`/api/reviews/${movieId}`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).equal(1);
                    expect(res.body[0].movieId).to.equal(movieId);
                });
        });

        it('should return a 404 status for an invalid movieId', async () => {
            const movieId = 666;
            await request(api)
                .get(`/${movieId}`)
                .expect(404);
        });

    })
})