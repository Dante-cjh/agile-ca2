import asyncHandler from 'express-async-handler';
import express from 'express';
import {getActor, getActors, getActorFilmCredits} from "../tmdb-api";

const router = express.Router();

// get discovery actors
router.get('/tmdb', asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page);
    const actors = await getActors(page);
    if (actors.success === false) {
        res.status(404).json(actors);
    } else {
        res.status(200).json(actors);
    }
}))

router.get('/tmdb/:id', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const actor = await getActor(id);
    if (actor.success === false) {
        res.status(404).json({status_message: 'The actor you requested could not be found.', status_code: 404});
    } else {
        res.status(200).json(actor);
    }
}));

router.get('/tmdb/:id/credits', asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const actorCredits = await getActorFilmCredits(id);
    if (actorCredits.success === false) {
        res.status(404).json(actorCredits);
    } else {
        res.status(200).json(actorCredits);
    }
}));

export default router;