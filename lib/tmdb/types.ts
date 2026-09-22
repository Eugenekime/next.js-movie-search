interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

type Genre = {
  id: number;
  name: string;
};

interface RatedMovie extends Movie {
  rating: number;
}
interface RatedMovieResponse {
  page: number;
  results: RatedMovie[];
  total_pages: number;
  total_results: number;
}

interface GuestSession {
  success: boolean;
  guest_session_id: string;
  expires_at: string;
}

type RateResponse = {
  success: boolean;
  status_code: number;
  status_message: string;
};

export type {
  Movie,
  MovieResponse,
  Genre,
  GuestSession,
  RateResponse,
  RatedMovieResponse,
};
