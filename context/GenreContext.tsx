'use client';

import { createContext, useContext } from 'react';
import type { Genre } from '@/lib/tmdb/types';

const GenreContext = createContext<Genre[]>([]);

export function GenreProvider({
  genres,
  children,
}: {
  genres: Genre[];
  children: React.ReactNode;
}) {
  return (
    <GenreContext.Provider value={genres}>{children}</GenreContext.Provider>
  );
}

export function useGenres() {
  return useContext(GenreContext);
}
