# Assignment 2 - Agile Software Practice.

Name: Jiahan Chen

## API endpoints.

- `GET /api/users` - Retrieves a list of all registered users.
- `GET /api/users/:id` - Fetches detailed information about a specific user by their unique ID.
- `POST /api/users?action=register` - Registers a new user with the provided details such as username and password.
- `POST /api/users?action=login` - Authenticates a user and returns a token for successful login.
- `PUT /api/users/:id` - Updates the information of a specific user, identified by their unique ID.
- `DELETE /api/users/:id` - Removes a user from the system based on their unique ID.



- `GET /api/movies` - Retrieves a list of all movies stored in the local database.
- `GET /api/movies/:id` - Fetches detailed information about a specific movie from the local database using its unique ID.
- `GET /api/movies/tmdb/movies` - Retrieves a list of discovery movies from TMDB's API, with optional pagination using a `page` query parameter.
- `GET /api/movies/tmdb/movie/:id` - Gets detailed information about a specific movie from TMDB using its unique ID.
- `GET /api/movies/tmdb/upcoming` - Fetches a list of upcoming movies from TMDB.
- `GET /api/movies/tmdb/genres` - Retrieves a list of movie genres from TMDB.
- `GET /api/movies/tmdb/:id/images` - Gets movie images for a specific movie from TMDB using its unique ID.
- `GET /api/movies/tmdb/:id/reviews` - Fetches reviews for a specific movie from TMDB using its unique ID.
- `GET /api/movies/tmdb/trendingMovie` - Retrieves a list of currently trending movies from TMDB.
- `GET /api/movies/tmdb/:id/credits` - Gets credit details for a specific movie from TMDB using its unique ID.



- `GET /api/actors/tmdb` - Retrieves a list of actors from TMDB, with optional pagination using a `page` query parameter.
- `GET /api/actors/tmdb/:id` - Fetches detailed information about a specific actor from TMDB using their unique ID.
- `GET /api/actors/tmdb/:id/credits` - Retrieves the film credits of a specific actor from TMDB using their unique ID.



- `GET /api/reviews/:movieId` - Retrieves all reviews associated with a specific movie, identified by its movie ID.
- `GET /api/reviews/author/review` (Auth) - Fetches all reviews written by the currently authenticated user.
- `POST /api/reviews/review` (Auth) - Allows an authenticated user to post a new review. Requires details like movie ID, content, and rating in the request body.
- `DELETE /api/reviews/review` (Auth) - Enables an authenticated user to delete a review they've written, identified by the review's unique ID in the request body.



- `GET /api/user/relevant/movies` (Auth) - Retrieves the list of favourite movies for the authenticated user.
- `POST /api/user/relevant/movies` (Auth) - Allows the authenticated user to add a movie to their list of favourites.
- `DELETE /api/user/relevant/movies` (Auth) - Enables the authenticated user to remove a movie from their list of favourites.
- `GET /api/user/relevant/actors` (Auth) - Fetches the favourite actors for the authenticated user.
- `POST /api/user/relevant/actors` (Auth) - Lets the authenticated user add an actor to their favourites.
- `DELETE /api/user/relevant/actors` (Auth) - Allows the authenticated user to remove an actor from their favourites.
- `GET /api/user/relevant/toWatch` (Auth) - Retrieves the list of movies the authenticated user wants to watch.
- `POST /api/user/relevant/toWatch` (Auth) - Permits the authenticated user to add a movie to their 'to watch' list.
- `DELETE /api/user/relevant/toWatch` (Auth) - Lets the authenticated user remove a movie from their 'to watch' list.

## Automated Testing.

~~~
  Users endpoint
    GET /api/users 
database connected to test on ac-fledhkd-shard-00-01.lvrdru0.mongodb.net
      √ should return the 2 users and a status 200 (41ms)
    POST /api/users 
      For a register action
        when the payload is correct
          √ should return a 201 status and the confirmation message (193ms)
      For an authenticate action
        when the payload is correct
          √ should return a 200 status and a generated token (91ms)
    User Relevant Movies API Tests
      GET /api/user/relevant/movies
        √ should return favourite movies for an authenticated user (72ms)
        √ should deny access for unauthenticated requests (39ms)
      POST /movies API Tests
        When the token is correct
          √ should successfully add a favourite movie for an authenticated user (96ms)
        When the token is wrong
          √ should deny access for unauthenticated requests
      DELETE /api/user/relevant/movies
        When user is authenticate
          √ should successfully remove a favourite movie for an authenticated user (86ms)
        When use is not authenticate
          √ should deny access for unauthenticated requests
      GET /api/user/relevant/actors
        √ should return favourite actors for an authenticated user (91ms)
        √ should deny access for unauthenticated requests
      POST /api/user/relevant/actors
        When the token is correct
          √ should successfully add a favourite actor for an authenticated user (126ms)
        When the token is wrong
          √ should deny access for unauthenticated requests
      DELETE /api/user/relevant/actors
        When user is authenticate
          √ should successfully remove a favourite actor for an authenticated user (69ms)
        When use is not authenticate
          √ should deny access for unauthenticated requests
      GET /api/user/relevant/toWatch
        √ should return must watch movies for an authenticated user (132ms)
        √ should deny access for unauthenticated requests
      POST /api/user/relevant/toWatch
        When the token is correct
          √ should successfully add a must watch movie for an authenticated user (77ms)
        When the token is wrong
          √ should deny access for unauthenticated requests
      DELETE /api/user/relevant/toWatch
        When user is authenticate
          √ should successfully remove a must watch movie for an authenticated user (51ms)
        When use is not authenticate
          √ should deny access for unauthenticated requests

  Movies endpoint
    GET /api/movies
      √ should return 20 movies and a status 200 (93ms)
    GET /api/movies/:id
      when the id is valid
        √ should return the matching movie (49ms)
      when the id is invalid
        √ should return the NOT found message
    GET TMDB movies
      GET /api/movies/tmdb
        √ should return a list of discovery movies for a valid page (109ms)
        √ should return the first page for an invalid page number (80ms)
      GET /api/movies/tmdb/movie/:id
        √ should return details of a movie for a valid ID (84ms)
        √ should return a 404 for a non-existent movie ID (152ms)
      GET /api/movies/tmdb/upcoming
        √ should return a list of upcoming movies (79ms)
      GET /api/movies/tmdb/genres
        √ should return a list of movie genres (75ms)
      GET /api/movies/tmdb/:id/reviews
        √ should return reviews for a valid movie ID (84ms)
        √ should return a 404 for a non-existent movie ID (147ms)
      GET /api/movies/tmdb/trendingMovie
        √ should return a list of trending movies (78ms)
      GET /api/movies/tmdb/:id/credits
        √ should return credits for a valid movie ID (74ms)
        √ should return a 404 for a non-existent movie ID (151ms)

  Actors endpoint
    GET TMDB actors
      GET /api/actors/tmdb
        √ should return a list of actors for a valid page (162ms)
        √ should return a 404 for an invalid page number (148ms)
      GET /api/actors/tmdb/:id
        √ should return actor details for a valid actor ID (157ms)
        √ should return a 404 for a non-existent actor ID (158ms)
      GET /api/actors/tmdb/:id/credits
        √ should return actor film credits for a valid actor ID (162ms)
        √ should return a 404 for a non-existent actor ID (172ms)

  Review endpoint
    GET /api/reviews/:movieId
      √ should retrieve reviews for a valid movieId
      √ should return a 404 status for an invalid movieId
    GET api/reviews/author/review
      √ should retrieve reviews by the logged-in author (49ms)
      √ should deny access for unauthenticated requests
    POST /api/reviews/review
      √ should successfully add a new review (63ms)
      √ should deny access for unauthenticated requests
    DELETE /api/reviews/review
      √ should successfully delete a review (81ms)
      √ should deny access for unauthenticated requests


  49 passing (18s)
~~~

[ Markdown Tip: By wrapping the test results in fences (~~~), GitHub will display it in a 'box' and preserve any formatting.]

NOTE: Your test code should only contain the test cases you implemented. Your assignment submission  must remove the test cases (it blocks) developed in the labs.

## Deployments.

Specify the URLs of your deployments, both staging and production, e.g.

https://movies-api-staging-doc-9200283e0b04.herokuapp.com/api/movies

[ I do NOT need the URL of the app on your Heroku dashboard as this is private, e.g.

https://dashboard.heroku.com/apps/movies-api-staging-doc ]

## Independent Learning (if relevant)

Sspecify the URL of the Coveralls webpage that contains your tests' code coverage metrics.

| File                             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| -------------------------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files                        | 85.95   | 57.14    | 89.49   | 89.1    |                   |
| movies-api-cicd                  | 100     | 100      | 100     | 100     |                   |
| index.js                         | 100     | 100      | 100     | 100     |                   |
| movies-api-cicd/api              | 93.22   | 58.24    | 93.33   | 96      |                   |
| tmdb-api.js                      | 93.22   | 58.24    | 93.33   | 96      | 52-55             |
| movies-api-cicd/api/actors       | 100     | 65       | 100     | 100     |                   |
| index.js                         | 100     | 65       | 100     | 100     | 2                 |
| movies-api-cicd/api/movies       | 91.93   | 72.72    | 93.18   | 93.5    |                   |
| index.js                         | 91.45   | 72       | 92.85   | 92.95   | 57,67-69,87       |
| movieModel.js                    | 100     | 100      | 100     | 100     |                   |
| movies-api-cicd/api/reviews      | 92.64   | 59.09    | 95      | 97.43   |                   |
| index.js                         | 93.44   | 57.14    | 100     | 100     | 2,9-55            |
| reviewModel.js                   | 85.71   | 100      | 50      | 83.33   | 14                |
| movies-api-cicd/api/userRelevant | 92.1    | 65.67    | 100     | 100     |                   |
| index.js                         | 92.1    | 65.67    | 100     | 100     | 2,7-118           |
| movies-api-cicd/api/users        | 83.33   | 56.31    | 90.9    | 87.09   |                   |
| index.js                         | 79.48   | 57.57    | 86.36   | 81.39   | 27,34-42,66       |
| userModel.js                     | 93.33   | 54.05    | 100     | 100     | 2-25              |
| movies-api-cicd/authenticate     | 93.54   | 56.75    | 100     | 100     |                   |
| index.js                         | 93.54   | 56.75    | 100     | 100     | 2,9-15            |
| movies-api-cicd/db               | 83.33   | 100      | 50      | 81.81   |                   |
| index.js                         | 83.33   | 100      | 50      | 81.81   | 11,14             |
| movies-api-cicd/errHandler       | 80      | 50       | 100     | 80      |                   |
| index.js                         | 80      | 50       | 100     | 80      | 5                 |
| movies-api-cicd/initialise-dev   | 100     | 100      | 100     | 100     |                   |
| movies.js                        | 100     | 100      | 100     | 100     |                   |
| reviews.js                       | 100     | 100      | 100     | 100     |                   |
| users.js                         | 100     | 100      | 100     | 100     |                   |
| movies-api-cicd/seedData         | 21.05   | 6.52     | 8.33    | 29.72   |                   |
| index.js                         | 18.18   | 6.52     | 8.33    | 25.71   | 14-49,52-54       |
| movies.js                        | 100     | 100      | 100     | 100     |                   |


State any other independent learning you achieved while completing this assignment.
