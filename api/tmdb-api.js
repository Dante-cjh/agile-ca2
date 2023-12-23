import fetch from 'node-fetch';

export const getUpcomingMovies = async () => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getGenres = async () => {
    try{
        const response = await fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_KEY}&language=en-US`
        );
        if (!response.ok) {
            throw new Error(response.json().message);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMovies = async (page) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_KEY}&language=en-US&include_adult=false&include_video=false&page=${page}`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMovie = async (id) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_KEY}`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMovieImages = async (id) => {
    try{
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/images?api_key=${process.env.TMDB_KEY}`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getMovieReviews = async (id) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${process.env.TMDB_KEY}`
        ).then((res) => res.json())
            .then((json) => {
                // console.log(json.results);
                return json.results;
            });
        return await response;
    } catch (error) {
        throw error;
    }
};

export const getTrendingMovie = async () => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.TMDB_KEY}&language=en-US&page=1`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const getMovieCredits = async (id) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_KEY}&language=en-US`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
}

export const getActors = async (page) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/person/popular?api_key=${process.env.TMDB_KEY}&language=en-US&page=${page}`
        )
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const getActor = async (id) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_KEY}&language=en-US`
        );
        return await response.json();
    } catch (error) {
        throw error
    }
};

export const getActorFilmCredits = async (id) => {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.TMDB_KEY}`
        );
        return await response.json();
    } catch (error) {
        throw error;
    }
}