'use client';

import MovieCard from '@/components/MovieCard';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { Row, Col, Pagination } from 'antd';
import Loading from '@/app/loading';
import { RatedMovieResponse } from '@/lib/tmdb/types';
import { useRating } from '@/context/RatingContext';

export default function RatedMovies() {
  const { ratingsVersion } = useRating();
  const [loader, setLoader] = useState(false);
  const [ratedMovies, setRatedMovies] = useState<RatedMovieResponse | null>(
    null,
  );
  const [page, setPage] = useState(1);
  useEffect(() => {
    async function getRatedMovies() {
      try {
        setLoader(true);
        const res = await fetch(`/api/rating-list?page=${page}`);

        if (!res.ok) {
          throw new Error('Couldn`t load rated movies');
        }

        const data: RatedMovieResponse = await res.json();

        setRatedMovies(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    }

    getRatedMovies();
  }, [page, ratingsVersion]);

  const pageSize = 20;

  if (loader)
    return (
      <Container>
        <Loading />
      </Container>
    );

  return (
    <Container>
      <Row gutter={[20, 20]}>
        {!ratedMovies || ratedMovies.results.length === 0 ? (
          <Col xs={24} sm={12} md={12} lg={12} style={{ height: '100vh' }}>
            <NoResult>You haven`t rated any movies yet</NoResult>
          </Col>
        ) : (
          ratedMovies.results.map((item) => (
            <Col
              xs={24}
              sm={12}
              md={12}
              lg={ratedMovies.results.length === 1 ? 14 : 12}
              key={item.id}
            >
              <MovieCard movie={item} />
            </Col>
          ))
        )}
      </Row>

      {ratedMovies && ratedMovies.total_results > pageSize && (
        <StyledPagination
          current={page}
          total={Math.min(ratedMovies?.total_results || 0, 500 * 20)}
          pageSize={pageSize}
          onChange={(page) => {
            setPage(page);
          }}
          showSizeChanger={false}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  background-color: white;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 36px;

  @media (min-width: 1024px) {
    width: 1024px;
    min-height: 756px;
    padding: 40px;
  }
`;
const StyledPagination = styled(Pagination)`
  .ant-pagination-item {
    border-radius: 8px;
  }

  .ant-pagination-item a {
    color: black;
  }

  .ant-pagination-item-active {
    border: none;
    background-color: #1890ff;
  }

  .ant-pagination-item-active a {
    color: white;
  }
`;

const NoResult = styled.p`
  display: flex;
  justify-content: center;
  text-align: center;
  width: 320px;
  min-width: 200px;
  font-size: 24px;
  font-weight: 600;
  align-self: center;
  color: grey;
  padding-top: 50px;
  @media (min-width: 1024px) {
    width: 1024px;
  }
`;
