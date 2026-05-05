import axios from 'axios';

const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x450?text=No+Poster+Available';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
});

export const getMovies = async (genres = '', page = 1) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        page,
        with_genres: genres,
      },
    });

    return response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : PLACEHOLDER_IMAGE,
      backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
      description: movie.overview,
      category: movie.genre_ids[0],
    }));
  } catch (error) {
    console.error('Error fetching movies from TMDB:', error);
    throw error;
  }
};

export const getTopRated = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/top_rated', { params: { page } });
    return response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : PLACEHOLDER_IMAGE,
      backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
      description: movie.overview,
    }));
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

export const getUpcoming = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/upcoming', { params: { page } });
    return response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : PLACEHOLDER_IMAGE,
      backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
      description: movie.overview,
    }));
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

export const getTrending = async () => {
  try {
    const response = await tmdbApi.get('/trending/movie/week');
    return response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : PLACEHOLDER_IMAGE,
      backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
      description: movie.overview,
    }));
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const getTvShows = async (genres = '', page = 1) => {
  try {
    const response = await tmdbApi.get('/discover/tv', {
      params: {
        page,
        with_genres: genres,
      },
    });

    return response.data.results.map((show) => ({
      id: show.id,
      title: show.name,
      poster: show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : PLACEHOLDER_IMAGE,
      backdrop: show.backdrop_path ? `${BACKDROP_BASE_URL}${show.backdrop_path}` : null,
      description: show.overview,
      category: show.genre_ids[0],
    }));
  } catch (error) {
    console.error('Error fetching TV shows from TMDB:', error);
    throw error;
  }
};

export const getRecommendedMovies = async (preferences = []) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: preferences.join(','),
      },
    });

    return response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : PLACEHOLDER_IMAGE,
      backdrop: movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
      description: movie.overview,
      category: movie.genre_ids[0],
    }));
  } catch (error) {
    console.error('Error fetching recommended movies from TMDB:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [{ id: 28, name: 'Action' }, { id: 35, name: 'Comedy' }, { id: 18, name: 'Drama' }, { id: 27, name: 'Horror' }];
  }
};

export default {
  getMovies,
  getTopRated,
  getUpcoming,
  getTrending,
  getTvShows,
  getRecommendedMovies,
  getCategories,
};
