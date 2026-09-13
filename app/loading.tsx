import { Flex, Spin } from 'antd';

const Loading: React.FC = () => (
  <Flex justify="center" align="center" style={{ minHeight: '100vh' }}>
    <Spin size="large" />
  </Flex>
);

export default Loading;
