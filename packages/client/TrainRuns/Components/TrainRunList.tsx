import { Fragment } from 'react';
import { Paper } from '@mui/material';
import { TrainRun } from 'client/TrainRuns/Components/TrainRun';
import styled from '@emotion/styled';
import type { FC } from 'react';
import type { TrainRunWithBR } from 'types/trainRuns';

interface Props {
  trainRuns: TrainRunWithBR[];
  selectedDate: Date;
}

const EntryContainer = styled(Paper)`
  grid-template-columns: 80px 0.5fr 100px 80px 2fr 2fr 1fr;
  grid-template-rows: 40px;
  display: grid;
  align-items: center;
  > span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Header: FC = () => (
  <EntryContainer>
    <span>Gattung</span>
    <span>Baureihe</span>
    <span>Zugnummer</span>
    <span>Linie</span>
    <span>Start</span>
    <span>Ziel</span>
    <span></span>
  </EntryContainer>
);

export const TrainRunList: FC<Props> = ({ trainRuns, selectedDate }) => {
  return (
    <div>
      {trainRuns.map((r, i) => (
        <Fragment key={r.product.number}>
          {i % 20 === 0 && <Header />}
          <EntryContainer>
            <TrainRun trainRun={r} selectedDate={selectedDate} />
          </EntryContainer>
        </Fragment>
      ))}
    </div>
  );
};
