'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { Movie, RatedMovieResponse } from '@/lib/tmdb/types';

type RatingContextType = {
  ratedMovies: RatedMovieResponse | null;
  ratings: Record<number, number>;
  rateMovie: (movie: Movie, rating: number) => void;
  page: number;
  setPage: (page: number) => void;
};

const RatingContext = createContext<RatingContextType | null>(null);

export function RatingProvider({ children }: { children: React.ReactNode }) {
  const [ratedMovies, setRatedMovies] = useState<RatedMovieResponse | null>(
    null,
  );
  const [ratings, setRatings] = useState<Record<number, number>>({});

  const [page, setPage] = useState(1);
  useEffect(() => {
    async function getRatedMovies() {
      try {
        const res = await fetch(`/api/rating-list?page=${page}`);

        if (!res.ok) {
          throw new Error('Couldn`t load rated movies');
        }

        const data: RatedMovieResponse = await res.json();

        setRatedMovies(data);
        setRatings((prev) => {
          const newRatings = { ...prev };

          data.results.forEach((movie) => {
            newRatings[movie.id] = movie.rating;
          });

          return newRatings;
        });
      } catch (error) {
        console.error(error);
      }
    }

    getRatedMovies();
  }, [page]);

  function rateMovie(movie: Movie, rating: number) {
    setRatings((prev) => ({
      ...prev,
      [movie.id]: rating,
    }));
    setRatedMovies((prev) => {
      if (!prev) return prev;
      const existingMovie = prev.results.some((item) => item.id === movie.id);

      if (existingMovie) {
        return {
          ...prev,
          results: prev.results.map((item) =>
            item.id === movie.id ? { ...item, rating } : item,
          ),
        };
      }

      return {
        ...prev,
        results: [
          ...prev.results,
          {
            ...movie,
            rating,
          },
        ],
        total_results: prev.total_results + 1,
      };
    });
  }

  return (
    <RatingContext.Provider
      value={{ ratedMovies, rateMovie, setPage, page, ratings }}
    >
      {children}
    </RatingContext.Provider>
  );
}

export function useRating() {
  const context = useContext(RatingContext);

  if (!context) {
    throw new Error('useRating must be used inside RatingProvider');
  }

  return context;
}
