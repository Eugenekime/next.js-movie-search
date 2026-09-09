import type { MovieResponse } from './types';

export default async function getMoviesByKeyword(
  name: string,
  page: number,
): Promise<MovieResponse> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${name}&include_adult=false&language=en-US&page=${page}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      },
    );

    if (!res.ok) {
      throw new Error('Couldn`t load movies');
    }

    const data: MovieResponse = await res.json();

    return data;
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Couldn`t load movies') {
        throw new Error(err.message);
      } else {
        throw new Error('No internet connection');
      }
    }

    throw new Error('Unknown error');
  }
}
