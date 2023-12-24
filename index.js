import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usersRouter from './api/users';
import './db';
import defaultErrHandler from './errHandler';
import moviesRouter from './api/movies';
import actorsRouter from './api/actors';
import reviewsRouter from './api/reviews';
import userRelevant from "./api/userRelevant";
import authenticate from './authenticate';
import './seedData';

dotenv.config();

const app = express();
const port = process.env.PORT; 

app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);
app.use('/api/movies',  moviesRouter);
app.use('/api/actors', actorsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/user/relevant', authenticate, userRelevant);
// app.use(defaultErrHandler);

let server = app.listen(port, () => {
  console.info(`Server running at ${port}`);
});
module.exports = server