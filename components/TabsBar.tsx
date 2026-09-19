'use client';
import { useState } from 'react';
import { MovieResponse } from '@/lib/tmdb/types';

import MovieList from './MovieList';
import RatedMovies from './RatedMovies';
import { Tabs } from 'antd';
import styled from 'styled-components';

export default function TabsBar({
  data,
  currentPage,
}: {
  data: MovieResponse;
  currentPage: number;
}) {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <StyledTabs
      activeKey={activeTab}
      onChange={setActiveTab}
      items={[
        {
          key: 'search',
          label: 'Search',
          children: <MovieList data={data} currentPage={currentPage} />,
        },
        {
          key: 'rated',
          label: 'Rated',
          children: <RatedMovies />,
        },
      ]}
    />
  );
}

const StyledTabs = styled(Tabs)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 10px 0px 0px 0px;
`;
