import Review from './reviewModel';
import asyncHandler from 'express-async-handler';
import express from 'express';
import authenticate from "../../authenticate";

const router = express.Router();

// Get all reviews
router.get('/:movieId', asyncHandler(async (req, res) => {
    const movieId = req.params.movieId;
    try {
        const reviews = await Review.find({movieId})
        res.status(200).json(reviews);
    } catch (error) {
        res.status(404).message("Can not find the movie")
    }
}));

router.get('/author/review', authenticate, asyncHandler(async (req, res) => {
    const author = req.user.username;
    try {
        const reviews = await Review.find({ author: author });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({message: 'Find movie reviews failed'});
    }
}))

router.post('/review', authenticate, asyncHandler(async (req, res) => {
    try {
        const id = req.body.id;
        const movieId = req.body.movieId;
        const author = req.user.username;
        const content = req.body.content;
        const rating = req.body.rating;

        // 创建新的 Review
        const newReview = new Review({
            id,
            movieId,
            author,
            content,
            rating
        });

        // 保存到 MongoDB
        await newReview.save();

        res.status(201).json({message: "Adding new reviews successfully"});
    } catch (error) {
        res.status(404).json({message: 'Error adding new reviews'});
    }
}))

router.delete('/review', authenticate, asyncHandler(async (req, res) => {
    try {
        const reviewId = req.body.id;
        await Review.findOneAndDelete({ id: reviewId });
        res.status(200).json({ message: 'Review successfully deleted' });
    } catch (error) {
        res.status(404).json({ message: 'Review not found' });
    }
}))

export default router;