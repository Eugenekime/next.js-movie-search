'use client';

import { createContext, useContext, useState } from 'react';
import type { Movie, RatedMovie } from '@/lib/tmdb/types';

type RatingContextType = {
  ratedMovies: RatedMovie[];
  rateMovie: (movie: Movie, rating: number) => void;
};

const RatingContext = createContext<RatingContextType | null>(null);

export function RatingProvider({ children }: { children: React.ReactNode }) {
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);

  function rateMovie(movie: Movie, rating: number) {
    setRatedMovies((prev) => {
      const existingMovie = prev.find((item) => item.movie.id === movie.id);

      if (existingMovie) {
        return prev.map((item) =>
          item.movie.id === movie.id ? { ...item, rating } : item,
        );
      }

      return [
        ...prev,
        {
          movie,
          rating,
        },
      ];
    });
  }

  return (
    <RatingContext.Provider value={{ ratedMovies, rateMovie }}>
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
