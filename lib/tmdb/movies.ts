import type { MovieResponse } from './types';

export default async function getMoviesByKeyword(
  name: string,
  page: number,
): Promise<MovieResponse> {
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
    if (res.status === 401) {
      throw new Error('Invalid API key');
    }

    if (res.status === 402) {
      throw new Error('Payment required');
    }

    if (res.status === 404) {
      throw new Error('Movie not found');
    }

    if (res.status === 429) {
      throw new Error('Too many requests');
    }
    throw new Error('Couldn`t load movies');
  }

  const data: MovieResponse = await res.json();

  return data;
}
