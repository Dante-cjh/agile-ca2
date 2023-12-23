import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    movieId : {type: Number},
    author: {type: String, required: true},
    content: {type: String, required: true},
    rating: {type: String, required: true}
})

ReviewSchema.statics.findByMovieDBId = function (id) {
    return this.findOne({ id: id });
};

export default mongoose.model('Review', ReviewSchema);