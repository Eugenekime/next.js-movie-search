'use client';

import MovieCard from '@/components/MovieCard';
import styled from 'styled-components';
import { Row, Col, Pagination } from 'antd';
import { MovieResponse, Genre } from '@/lib/tmdb/types';
import { useRouter } from 'next/navigation';

export default function MovieList({
  data,
  genres,
  currentPage,
}: {
  data: MovieResponse;
  genres: Genre[];
  currentPage: number;
}) {
  const router = useRouter();

  return (
    <Container>
      <Row gutter={[20, 20]}>
        {data.results.map((movie) => (
          <Col xs={24} sm={12} md={12} lg={12} key={movie.id}>
            <MovieCard movie={movie} genres={genres} />
          </Col>
        ))}
      </Row>
      <StyledPagination
        current={currentPage}
        total={data.total_results}
        onChange={(page) => router.push(`/?page=${page}`)}
        showSizeChanger={false}
        pageSize={20}
      />
    </Container>
  );
}

const Container = styled.div`
  background-color: white;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 36px;

  @media (min-width: 1024px) {
    max-width: 1024px;
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
