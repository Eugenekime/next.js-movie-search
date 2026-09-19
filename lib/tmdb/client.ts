const BASE_URL = 'https://api.themoviedb.org/3/';

export const urlForGuestSession = 'authentication/guest_session/new';

export const getMovieByKeyWordURL = (name: string, page: number) => {
  const params = new URLSearchParams();
  params.set('query', name);
  params.set('include_adult', 'false');
  params.set('language', 'en-US');
  params.set('page', String(page));
  const res = `search/movie?${params.toString()}`;

  return res;
};

export const rateMovieURL = (movieId: number, guestSessionId: string) => {
  const params = new URLSearchParams();
  params.set('guest_session_id', guestSessionId);
  const res = `movie/${movieId}/rating?${params.toString()}`;
  return res;
};

export const getGenresURL = () => {
  const params = new URLSearchParams();
  params.set('language', 'en');
  const res = `genre/movie/list?${params.toString()}`;
  return res;
};

export class FetcherError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function Fetcher<T>({
  url,
  options,
}: {
  url: string;
  options?: RequestInit;
}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
    ...options?.headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new FetcherError('Invalid API key', res.status);
    }

    if (res.status === 402) {
      throw new FetcherError('Payment required', res.status);
    }

    if (res.status === 404) {
      throw new FetcherError('Resource not found', res.status);
    }

    if (res.status === 429) {
      throw new FetcherError('Too many requests', res.status);
    }

    throw new FetcherError('Couldn`t load movies', res.status);
  }

  const data: T = await res.json();

  return data;
}
