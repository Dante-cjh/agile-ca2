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

        describe("GET /api/actors/tmdb/:id", () => {
            // Test for successfully retrieving actor details for a valid ID
            it("should return actor details for a valid actor ID", (done) => {
                const validId = 123; // Example of a valid actor ID
                request(api)
                    .get(`/api/actors/tmdb/${validId}`)
                    .set("Accept", "application/json")
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.be.an("object");
                        // Add more specific assertions for the expected structure of actor details
                        done(err);
                    });
            });

            // Error test: Non-existent actor ID
            it("should return a 404 for a non-existent actor ID", (done) => {
                const invalidId = 99999999; // Example of an invalid actor ID
                request(api)
                    .get(`/api/actors/tmdb/${invalidId}`)
                    .set("Accept", "application/json")
                    .expect(404)
                    .end((err, res) => {
                        expect(res.body).to.have.property("status_message", "The actor you requested could not be found.");
                        done(err);
                    });
            });
        });


    });
});
