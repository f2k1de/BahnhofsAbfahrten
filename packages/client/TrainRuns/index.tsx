import { Header } from 'client/TrainRuns/Components/Header';
import { TrainRunProvider } from 'client/TrainRuns/provider/TrainRunProvider';
import { TrainRunRoutes } from 'client/TrainRuns/TrainRunRoutes';
import styled from '@emotion/styled';
import type { FC } from 'react';

const Container = styled.main`
  margin-left: 0.5em;
  margin-right: 0.5em;
  height: 100%;
`;

export const TrainRuns: FC = () => (
  <>
    <Header />
    <Container>
      <TrainRunProvider>
        <TrainRunRoutes />
      </TrainRunProvider>
    </Container>
  </>
);

// eslint-disable-next-line import/no-default-export
export default TrainRuns;
