'use client';

import { useState, useEffect } from 'react';
import { Alert } from 'antd';
import styled from 'styled-components';

export default function OfflineAlert() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
    };
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;
  return (
    <Wrapper>
      <BigAlert
        title="No internet connection"
        description="Please check your internet connection."
        type="error"
        showIcon
      />
    </Wrapper>
  );
}

const BigAlert = styled(Alert)`
  .ant-alert-title {
    font-size: 26px !important;
    font-weight: 600;
  }

  .ant-alert-description {
    font-size: 18px;
  }

  .ant-alert-icon {
    font-size: 40px !important;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  z-index: 3;
`;
