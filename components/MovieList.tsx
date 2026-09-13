'use client';

import { useState, useEffect, useMemo } from 'react';
import MovieCard from '@/components/MovieCard';
import styled from 'styled-components';
import { Row, Col, Pagination } from 'antd';
import debounce from 'lodash/debounce';
import { MovieResponse, Genre } from '@/lib/tmdb/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from 'antd';

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
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? 'return';
  const [value, setValue] = useState(search);

  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(searchParams);

        params.set('search', value);
        params.set('page', '1');

        router.push(`/?${params.toString()}`);
      }, 500),
    [searchParams, router],
  );

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, [handleSearch]);

  return (
    <Container>
      <Input
        placeholder="Type to search..."
        onChange={(event) => {
          setValue(event.target.value);
          handleSearch(event.target.value);
        }}
        value={value}
      />
      <Row gutter={[20, 20]}>
        {data.results.length === 0 ? (
          <Col xs={24} sm={12} md={12} lg={12} style={{ height: '100vh' }}>
            <NoResult>No result</NoResult>
          </Col>
        ) : (
          data.results.map((movie) => (
            <Col xs={24} sm={12} md={12} lg={12} key={movie.id}>
              <MovieCard movie={movie} genres={genres} />
            </Col>
          ))
        )}
      </Row>
      {data.results.length > 0 && (
        <StyledPagination
          current={currentPage}
          total={data.total_results}
          onChange={(page) => {
            const params = new URLSearchParams(searchParams);

            params.set('search', search);
            params.set('page', String(page));

            router.push(`/?${params.toString()}`);
          }}
          showSizeChanger={false}
          pageSize={20}
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

const NoResult = styled.p`
  display: flex;
  justify-content: center;
  min-width: 200px;
  font-size: 24px;
  font-weight: 600;
  align-self: center;
  color: grey;
  padding-top: 50px;
`;
