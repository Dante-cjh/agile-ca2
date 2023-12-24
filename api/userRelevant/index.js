import express from 'express';
import User from '../users/userModel';
import authenticate from "../../authenticate";

const router = express.Router(); // eslint-disable-line

router.get('/movies', authenticate, async (req, res) => {
    const username = req.user.username;

    try {
        const user = await User.findOne({ username }).select('favouriteMovies');
        res.status(200).json(user);
    } catch (error) {
        res.status(401).json({ message: 'Error retrieving favourite movies' });
    }
});

router.post('/movies', authenticate, async (req, res) => {
    const userName = req.user.username;
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

router.delete('/movies', authenticate, async (req, res) => {
    const userName =  req.user.username;
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

router.get('/actors', authenticate, async (req, res) => {
    const username = req.user.username;
    try {
        const user = await User.findOne({username}).select('favouriteActors');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving favourite actors'});
    }
});

router.post('/actors', authenticate, async (req, res) => {
    const userName = req.user.username;
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
    const userName =  req.user.username;
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

router.get('/toWatch', authenticate, async (req, res) => {
    const username = req.user.username;

    try {
        const user = await User.findOne({username}).select('toWatchMovies');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Error retrieving must watch movies'});
    }
});

router.post('/toWatch', authenticate, async (req, res) => {
    const userName = req.user.username;
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
    const userName = req.user.username;
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