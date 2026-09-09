'use client';

import { Alert, Button, Flex } from 'antd';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
      <Alert
        title={error.name}
        showIcon
        description={error.message}
        type="error"
        action={
          <Button size="small" danger onClick={() => reset()}>
            Retry
          </Button>
        }
      />
    </Flex>
  );
}
