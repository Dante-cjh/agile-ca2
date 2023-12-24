import express from 'express';
import User from '../users/userModel';
import jwt from 'jsonwebtoken';

const router = express.Router(); // eslint-disable-line

router.get('/:username/movies', async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({username}).select('favouriteMovies');
        res.status(200).json(user.favouriteMovies);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving favourite movies'});
    }
});

router.post('/movies', async (req, res) => {
    const userName = req.body.username;
    const movieId = req.body.movieId;

    try {
        await User.findOneAndUpdate(
            {username: userName}, // 使用用户名作为查找条件
            {$addToSet: {favouriteMovies: movieId}}, // 更新操作
            {new: true}
        );
        res.status(200).json({message: 'Favourite movie added successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error adding favourite movie'});
    }
});

router.delete('/movies', async (req, res) => {
    const userName = req.body.username;
    const movieId = req.body.movieId;

    try {
        await User.findOneAndUpdate(
            {username: userName},
            {$pull: {favouriteMovies: movieId}}, // 使用 $pull 来移除电影 ID
            {new: true}
        );
        res.status(200).json({message: 'Favourite movie removed successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error removing favourite movie'});
    }
});

router.get('/:username/actors', async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({username}).select('favouriteActors');
        res.status(200).json(user.favouriteActors);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving favourite actors'});
    }
});

router.post('/actors', async (req, res) => {
    const userName = req.body.username;
    const actorId = req.body.actorId;
    try {
        await User.findOneAndUpdate(
            {username: userName}, // 使用用户名作为查找条件
            {$addToSet: {favouriteActors: actorId}}, // 更新操作
            {new: true}
        );
        res.status(200).json({message: 'Favourite actor added successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error adding favourite actor'});
    }
});

router.delete('/actors', async (req, res) => {
    const userName = req.body.username;
    const actorId = req.body.actorId;

    try {
        await User.findOneAndUpdate(
            {username: userName},
            {$pull: {favouriteActors: actorId}}, // 使用 $pull 来移除电影 ID
            {new: true}
        );
        res.status(200).json({message: 'Favourite actor removed successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error removing favourite actor'});
    }
});

router.get('/:username/toWatch', async (req, res) => {
    const username = req.params.username;

    try {
        const user = await User.findOne({username}).select('toWatchMovies');
        res.status(200).json(user.toWatchMovies);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving must watch movies'});
    }
});

router.post('/toWatch', async (req, res) => {
    const userName = req.body.username;
    const movieId = req.body.movieId;

    try {
        await User.findOneAndUpdate(
            {username: userName}, // 使用用户名作为查找条件
            {$addToSet: {toWatchMovies: movieId}}, // 更新操作
            {new: true}
        );
        res.status(200).json({message: 'Must watch movie added successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error adding must watch movie'});
    }
});

router.delete('/toWatch', async (req, res) => {
    const userName = req.body.username;
    const movieId = req.body.movieId;

    try {
        await User.findOneAndUpdate(
            {username: userName},
            {$pull: {toWatchMovies: movieId}}, // 使用 $pull 来移除电影 ID
            {new: true}
        );
        res.status(200).json({message: 'Must watch movie removed successfully'});
    } catch (error) {
        res.status(500).json({message: 'Error removing must watch movie'});
    }
});

export default router;