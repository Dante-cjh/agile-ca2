import chai from "chai";
import request from "supertest";
import api from "../../../../index";

const expect = chai.expect;


describe("Actors endpoint", () => {

    after(() => {
        api.close(); // Release PORT 8080
    });

    describe("GET TMDB actors", () => {

        describe("GET /api/actors/tmdb", () => {
            // Test for successfully retrieving a list of actors
            it("should return a list of actors for a valid page", (done) => {
                const validPage = 1; // Example of a valid page number
                request(api)
                    .get(`/api/actors/tmdb?page=${validPage}`)
                    .set("Accept", "application/json")
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.results).to.be.a("array");
                        done(err);
                    });
            });

            // Error test: Invalid page number
            it("should return a 404 for an invalid page number", (done) => {
                const invalidPage = "invalid-page"; // Example of an invalid page number
                request(api)
                    .get(`/api/actors/tmdb?page=${invalidPage}`)
                    .set("Accept", "application/json")
                    .expect(404)
                    .end((err, res) => {
                        expect(res.body).to.have.property("status_message", "Invalid page: Pages start at 1 and max at 500. They are expected to be an integer.");
                        done(err);
                    });
            });
        });

        

    });
});
