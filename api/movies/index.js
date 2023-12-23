import movieModel from './movieModel';
import asyncHandler from 'express-async-handler';
import express from 'express';
import {
    getUpcomingMovies,
    getGenres,
    getMovieImages,
    getMovieReviews,
    getTrendingMovie,
    getMovieCredits, getMovies, getMovie
} from '../tmdb-api';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.query; // destructure page and limit and set default values
    [page, limit] = [+page, +limit]; //trick to convert to numeric (req.query will contain string values)

    // Parallel execution of counting movies and getting movies using movieModel
    const [total_results, results] = await Promise.all([
        movieModel.estimatedDocumentCount(),
        movieModel.find().limit(limit).skip((page - 1) * limit)
    ]);
    const total_pages = Math.ceil(total_results / limit); //Calculate total number of pages (= total No Docs/Number of docs per page)

    //construct return Object and insert into response object
    const returnObject = {
        page,
        total_pages,
        total_results,
        results
    };
    res.status(200).json(returnObject);
}));

// get discovery movies
router.get('/tmdb', asyncHandler(async (req, res) => {
    const page = req.query.page;
    const movies = await getMovies(page);
    if (movies) {
        res.status(200).json(movies);
    } else {
        res.status(404).json({message: 'The movies you requested could not be found.', status_code: 404});
    }
}))

router.get('/tmdb/movie/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movie = await getMovie(id);
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).json({message: 'The movie you requested could not be found.', status_code: 404});
    }
}));

router.get('/tmdb/upcoming', asyncHandler(async (req, res) => {
    const upcomingMovies = await getUpcomingMovies();
    if (upcomingMovies) {
        res.status(200).json(upcomingMovies);
    } else {
        res.status(404).json({message: 'The movie you requested could not be found.', status_code: 404})
    }
}));

router.get('/tmdb/genres', asyncHandler(async (req, res) => {
    const genres = await getGenres();
    res.status(200).json(genres);
}));

router.get('/tmdb/:id/images', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movieImages = await getMovieImages(id);
    res.status(200).json(movieImages);
}))

router.get('/tmdb/:id/reviews', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movieReviews = await getMovieReviews(id);
    if (movieReviews) {
        res.status(200).json(movieReviews);
    } else {
        res.status(404).json({message: 'The movie reviews you requested could not be found.', status_code: 404});
    }
}))

router.get('/tmdb/trendingMovie', asyncHandler(async (req, res) => {
    const trendingMovies = await getTrendingMovie();
    if (trendingMovies) {
        res.status(200).json(trendingMovies);
    } else {
        res.status(404).json({message: 'The trending movies you requested could not be found.', status_code: 404});
    }
}))

router.get('/tmdb/:id/credits', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movieCredits = await getMovieCredits(id);
    res.status(200).json(movieCredits);
}))

export default router;