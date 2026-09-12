'use client';
import styled from 'styled-components';
import { Alert, Button, Flex } from 'antd';

export default function Error({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  return (
    <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
      <BigAlert
        title={error.name}
        showIcon
        description={error.message}
        type="error"
        action={
          <Button size="large" danger onClick={() => retry()}>
            Retry
          </Button>
        }
      />
    </Flex>
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
