import SumBatterTable from './SumBatterTable';
import SumPitcherTable from './SumPitcherTable';
import { StyledGame } from '../styled';

const Overview = ({ sumBatters, sumPitchers }) => {
  return (
    <StyledGame>
      <SumBatterTable batters={sumBatters} />
      <SumPitcherTable pitchers={sumPitchers} />
    </StyledGame>
  );
};

export default Overview;
