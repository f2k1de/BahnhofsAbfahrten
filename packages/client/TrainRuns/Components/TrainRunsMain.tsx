import { TrainRunList } from 'client/TrainRuns/Components/TrainRunList';
import { useTrainRuns } from 'client/TrainRuns/provider/TrainRunProvider';
import type { FC } from 'react';

export const TrainRunsMain: FC = () => {
  const { trainRuns, selectedDate } = useTrainRuns();
  if (trainRuns && selectedDate) {
    return <TrainRunList trainRuns={trainRuns} selectedDate={selectedDate} />;
  }
  return null;
};
