'use client';

import { useState } from 'react';
import MovieCard from '@/components/MovieCard';
import styled from 'styled-components';
import { useRating } from '@/context/RatingContext';
import { Row, Col, Pagination } from 'antd';

export default function RatedMovies() {
  const { ratedMovies } = useRating();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentMovies = ratedMovies.slice(startIndex, endIndex);

  return (
    <Container>
      <Row gutter={[20, 20]}>
        {ratedMovies.length === 0 ? (
          <Col xs={24} sm={12} md={12} lg={12} style={{ height: '100vh' }}>
            <NoResult>No result</NoResult>
          </Col>
        ) : (
          currentMovies.map((item) => (
            <Col
              xs={24}
              sm={12}
              md={12}
              lg={ratedMovies.length === 1 ? 14 : 12}
              key={item.movie.id}
            >
              <MovieCard movie={item.movie} rating={item.rating} />
            </Col>
          ))
        )}
      </Row>

      {ratedMovies.length > 1 && (
        <StyledPagination
          current={currentPage}
          total={ratedMovies.length}
          pageSize={pageSize}
          onChange={(page) => {
            setCurrentPage(page);
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
  width: 1024px;
  min-width: 200px;
  font-size: 24px;
  font-weight: 600;
  align-self: center;
  color: grey;
  padding-top: 50px;
`;
