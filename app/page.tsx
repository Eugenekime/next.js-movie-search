import MovieList from '@/components/MovieList';
import getMoviesByKeyword from '@/lib/tmdb/movies';
import getGenresList from '@/lib/tmdb/genres';
import styled from 'styled-components';

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};
export default async function Home({ searchParams }: Props) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const [movies, genres] = await Promise.all([
    getMoviesByKeyword('return', page),
    getGenresList(),
  ]);
  return (
    <Wrapper>
      <MovieList data={movies} genres={genres} currentPage={page} />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;

  @media (min-width: 768px) {
    padding: 26px;
  }

  @media (min-width: 1024px) {
    padding: 36px;
    background-color: #f0eeee;
  }
`;
