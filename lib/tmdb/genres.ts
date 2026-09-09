import type { Genre } from './types';

export default async function getGenresList(): Promise<Genre[]> {
  const res = await fetch(
    'https://api.themoviedb.org/3/genre/movie/list?language=en',
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
      next: {
        revalidate: 86400,
      },
    },
  );

  if (!res.ok) {
    throw new Error('Couldn`t load genres');
  }

  const data: { genres: Genre[] } = await res.json();

  return data.genres;
}
