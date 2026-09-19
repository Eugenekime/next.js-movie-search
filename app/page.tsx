import styled from 'styled-components';
import OfflineAlert from '@/components/OfflineAlert';
import TabsBar from '@/components/TabsBar';
import { Fetcher, getMovieByKeyWordURL } from '@/lib/tmdb/client';
import { MovieResponse } from '@/lib/tmdb/types';

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
};
export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search || 'return';
  const pageNumber = Number(params.page);
  const page = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;

  const movies = await Fetcher<MovieResponse>({
    url: getMovieByKeyWordURL(search, page),
  });

  return (
    <Wrapper>
      <OfflineAlert />
      <TabsBar data={movies} currentPage={page} />
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
