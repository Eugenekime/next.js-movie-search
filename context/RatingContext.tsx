'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { RatedMovieResponse } from '@/lib/tmdb/types';

type RatingContextType = {
  ratings: Record<number, number>;
  rateMovie: (movieId: number, rating: number) => void;
  ratingsVersion: number;
};

const RatingContext = createContext<RatingContextType | null>(null);

export function RatingProvider({ children }: { children: React.ReactNode }) {
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [ratingsVersion, setRatingsVersion] = useState(0);

  function rateMovie(movieId: number, rating: number) {
    setRatings((prev) => ({
      ...prev,
      [movieId]: rating,
    }));
    setRatingsVersion((prev) => prev + 1);
  }

  useEffect(() => {
    async function getRatedMovies() {
      try {
        const res = await fetch(`/api/rating-list?page=1`);
        if (!res.ok) {
          throw new Error('Couldn`t load rated movies');
        }

        const data: RatedMovieResponse = await res.json();

        data.results.forEach((movie) => {
          setRatings((prev) => ({
            ...prev,
            [movie.id]: movie.rating,
          }));
        });

        for (let page = 2; page <= data.total_pages; page++) {
          const res = await fetch(`/api/rating-list?page=${page}`);
          if (!res.ok) {
            throw new Error(`Couldn't load rated movie in ${page} page`);
          }
          const pageData: RatedMovieResponse = await res.json();

          pageData.results.forEach((movie) => {
            setRatings((prev) => ({
              ...prev,
              [movie.id]: movie.rating,
            }));
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    getRatedMovies();
  }, []);

  return (
    <RatingContext.Provider value={{ rateMovie, ratings, ratingsVersion }}>
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
