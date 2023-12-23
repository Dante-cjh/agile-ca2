import chai from "chai";
import request from "supertest";

const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";

const expect = chai.expect;
let db;

describe("Movies endpoint", () => {
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
            await Movie.deleteMany();
            await Movie.collection.insertMany(movies);
        } catch (err) {
            console.error(`failed to Load user Data: ${err}`);
        }
    });
    afterEach(() => {
        api.close(); // Release PORT 8080
    });
    describe("GET /api/movies ", () => {
        it("should return 20 movies and a status 200", (done) => {
            request(api)
                .get("/api/movies")
                .set("Accept", "application/json")
                .expect(200)
                .end((err, res) => {
                    expect(res.body).to.be.a("array");
                    expect(res.body.length).to.equal(20);
                    done();
                });
        });
    });

    describe("GET /api/movies/:id", () => {
        describe("when the id is valid", () => {
            it("should return the matching movie", () => {
                return request(api)
                    .get(`/api/movies/${movies[0].id}`)
                    .set("Accept", "application/json")
                    .expect(200)
                    .then((res) => {
                        expect(res.body).to.have.property("title", movies[0].title);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return the NOT found message", () => {
                return request(api)
                    .get("/api/movies/9999")
                    .set("Accept", "application/json")
                    .expect(404)
                    .expect({
                        status_code: 404,
                        message: "The resource you requested could not be found.",
                    });
            });
        });
    });

    describe("GET TMDB movies", () => {

        describe("GET /api/movies/tmdb", () => {
            // Get movie list normally
            it("should return a list of discovery movies for a valid page", (done) => {
                request(api)
                    .get("/api/movies/tmdb/movies?page=1")
                    .set("Accept", "application/json")
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.results).to.be.an("array");
                        done(err);
                    });
            });

            // Boundary test: invalid page number
            it("should return the first page for an invalid page number", (done) => {
                request(api)
                    .get("/api/movies/tmdb/movies/?page=invalid-page")
                    .set("Accept", "application/json")
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.page).equal(1);
                        done(err);
                    });
            });
        });

        describe("GET /api/movies/tmdb/movie/:id", () => {
            // Get the movie details for the corresponding id normally
            it("should return details of a movie for a valid ID", (done) => {
                const validId = 550; // 假设550是一个有效的电影ID
                request(api)
                    .get(`/api/movies/tmdb/movie/${validId}`)
                    .set("Accept", "application/json")
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an("object");
                        expect(res.body).to.have.property("id", validId);
                        done(err);
                    });
            });

            // Bug test: invalid movie ID
            it("should return a 404 for a non-existent movie ID", (done) => {
                const invalidId = 9999999; // This is an invalid movie ID
                request(api)
                    .get(`/api/movies/tmdb/movie/${invalidId}`)
                    .set("Accept", "application/json")
                    .expect(404)
                    .end((err, res) => {
                        expect(res.body).to.have.property("message", "The movie you requested could not be found.");
                        done(err);
                    });
            });
        });

        describe("GET /api/movies/tmdb/upcoming", () => {
            // Test for successfully retrieving upcoming movies
            it("should return a list of upcoming movies", (done) => {
                request(api)
                    .get("/api/movies/tmdb/upcoming")
                    .set("Accept", "application/json")
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.results).to.be.an("array");
                        done(err);
                    });
            });
        });


    });
});
