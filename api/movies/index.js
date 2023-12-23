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
    const movies = await movieModel.find();
    res.status(200).json(movies);
}));

// Get movie details
router.get('/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movie = await movieModel.findByMovieDBId(id);
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).json({message: 'The resource you requested could not be found.', status_code: 404});
    }
}));

// get discovery movies
router.get('/tmdb/movies', asyncHandler(async (req, res) => {
    const page = req.query.page;
    try {
        const movies = await getMovies(page);
        res.status(200).json(movies);
    }catch (error) {
        res.status(404).json({message: 'The movies you requested could not be found.', status_code: 404});
    }
}))

router.get('/tmdb/movie/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const movie = await getMovie(id);
    if (movie.success === false) {
        res.status(404).json({message: 'The movie you requested could not be found.', status_code: 404});
    } else {
        res.status(200).json(movie);
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
    if(movieCredits.success === false) {
        res.status(404).json(movieCredits);
    } else {
        res.status(200).json(movieCredits);
    }
}))

export default router;