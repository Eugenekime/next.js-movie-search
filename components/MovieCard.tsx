import type { Movie } from '@/lib/tmdb/types';
import { useRating } from '@/context/RatingContext';
import { Rate, Tag } from 'antd';
import Image from 'next/image';
import styled from 'styled-components';
import { format } from 'date-fns';
import truncateText from '@/lib/truncateText';
import { useGenres } from '@/context/GenreContext';

export default function MovieCard({ movie }: { movie: Movie }) {
  const { rateMovie, ratings } = useRating();
  const ratedMovie = ratings[movie.id];

  async function handleRate(value: number) {
    try {
      const res = await fetch(`/api/rating?movie_id=${movie.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      rateMovie(movie, value);
    } catch (error) {
      console.error(error);
    }
  }
  const genres = useGenres();
  const genreMap = new Map(genres.map((genre) => [genre.id, genre.name]));
  function getRatingColor(rating: number) {
    if (rating <= 3) {
      return '#E90000';
    }

    if (rating <= 5) {
      return '#E97E00';
    }

    if (rating <= 7) {
      return '#E9D100';
    }

    return '#66E900';
  }

  const ratingColor = getRatingColor(movie.vote_average);
  return (
    <Wrapper>
      <Container>
        <TopContainer>
          {movie.poster_path ? (
            <Poster
              width={60}
              height={90}
              src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
              alt="Movie poster"
              sizes="(min-width: 1024px) 180px, 60px"
              loading="eager"
            />
          ) : (
            <PosterPlaceholder>No poster</PosterPlaceholder>
          )}
          <ContainerInfo>
            <ContainerInfoTitle>
              <InfoTitle>{movie.original_title}</InfoTitle>
              <VoteIcon $color={ratingColor}>
                {Math.round(movie.vote_average * 10) / 10}
              </VoteIcon>
            </ContainerInfoTitle>

            <InfoDate>
              {movie.release_date
                ? format(new Date(movie.release_date), 'MMMM d, yyyy')
                : 'Release date unknown'}
            </InfoDate>
            <InfoContainerGenre>
              {movie.genre_ids.map((i) => {
                const genreName = genreMap.get(i);

                return genreName ? <Tag key={i}>{genreName}</Tag> : <></>;
              })}
            </InfoContainerGenre>
          </ContainerInfo>
          <Overview>
            {truncateText(movie.overview, 125) || 'No description available.'}
          </Overview>
          <ContainerRate>
            <MobileRateWrapper>
              <Rate
                count={5}
                value={ratedMovie ? ratedMovie / 2 : 0}
                allowHalf
                onChange={(value) => handleRate(value * 2)}
              />
            </MobileRateWrapper>

            <DesktopRateWrapper>
              <Rate
                count={10}
                value={ratedMovie ?? 0}
                allowHalf
                onChange={handleRate}
              />
            </DesktopRateWrapper>
          </ContainerRate>
        </TopContainer>
      </Container>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  background-color: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  @media (min-width: 1024px) {
    min-height: 280px;
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 6px 10px;
  @media (min-width: 1024px) {
    padding: 0px;
    height: 280px;
  }
`;

const Poster = styled(Image)`
  width: 60px;
  height: 90px;
  object-fit: cover;
  flex-shrink: 0;

  @media (min-width: 1024px) {
    width: 180px;
    height: 279px;
    grid-row: 1 / 4;
  }
`;

const PosterPlaceholder = styled.div`
  width: 60px;
  height: 90px;
  flex-shrink: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #ddd;
  color: #777;
  font-size: 12px;

  @media (min-width: 1024px) {
    width: 180px;
    height: 279px;
    grid-row: 1 / 5;
  }
`;

const TopContainer = styled.div`
  width: 100%;

  display: grid;

  /* MOBILE */
  grid-template-columns: 60px minmax(0, 1fr);
  gap: 8px;
  align-items: start;

  @media (min-width: 1024px) {
    /* DESKTOP */
    grid-template-columns: 180px minmax(0, 1fr);
  }
`;

const ContainerInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
  @media (min-width: 1024px) {
    padding: 10px 7px 0px 7px;
  }
`;
const ContainerInfoTitle = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  height: 50px;
`;
const InfoTitle = styled.p`
  min-width: 0;
  font-size: 20px;
  line-height: 28px;
  overflow: hidden;
`;
const VoteIcon = styled.p<{ $color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  font-size: 12px;
  border: 1px solid ${({ $color }) => $color};
  border-radius: 50%;
  flex-shrink: 0;
`;

const InfoDate = styled.p`
  font-size: 12px;
  line-height: 22px;
  color: #827e7e;
`;

const InfoContainerGenre = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 1px;
  }

  @media (min-width: 1024px) {
    overflow-x: inherit;
    flex-wrap: wrap;
  }
`;

const Overview = styled.p`
  font-size: 12px;
  line-height: 22px;

  width: 100%;
  height: 92px;
  padding-right: 4px;
  grid-column: 1 / -1;

  @media (min-width: 1024px) {
    /* DESKTOP */
    grid-column: 2;
    height: 60px;
    padding: 0px 7px 10px 7px;
  }
`;

const ContainerRate = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  grid-column: 1 / -1;

  @media (min-width: 1024px) {
    /* DESKTOP */
    grid-column: 2;
    justify-content: flex-start;
    align-items: center;
    padding: 0px 6px 0px 6px;
  }
`;

const MobileRateWrapper = styled.div`
  display: flex;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const DesktopRateWrapper = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    .ant-rate {
      font-size: 18px;
    }
  }
`;
