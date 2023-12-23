import express from 'express';
import User from './userModel';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

// register(Create)/Authenticate User
router.post('/', asyncHandler(async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({success: false, msg: 'Username and password are required.'});
        }
        if (req.query.action === 'register') {
            await registerUser(req, res);
        } else {
            await authenticateUser(req, res);
        }
    } catch (error) {
        // Log the error and return a generic error message
        console.error(error);
        res.status(500).json({success: false, msg: 'Internal server error.'});
    }
}));

// Update a user
router.put('/:id', async (req, res) => {
    if (req.body._id) delete req.body._id;
    const result = await User.updateOne({
        _id: req.params.id,
    }, req.body);
    if (result.matchedCount) {
        res.status(200).json({code: 200, msg: 'User Updated Sucessfully'});
    } else {
        res.status(404).json({code: 404, msg: 'Unable to Update User'});
    }
});

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

async function registerUser(req, res) {
    const user = await User.findByUserName(req.body.username);
    if (!user) {
        await User.create(req.body);
        res.status(201).json({success: true, msg: 'User successfully created.'});
    } else {
        res.status(401).json({success: false, msg: 'User existed!'});
    }
}

async function authenticateUser(req, res) {
    const user = await User.findByUserName(req.body.username);
    if (!user) {
        return res.status(401).json({success: false, msg: 'Authentication failed. User not found.'});
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (isMatch) {
        const token = jwt.sign({username: user.username}, process.env.SECRET);
        res.status(200).json({success: true, token: 'BEARER ' + token});
    } else {
        res.status(401).json({success: false, msg: 'Wrong password.'});
    }
}

export default router;