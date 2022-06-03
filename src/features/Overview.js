import * as R from 'ramda';
import SumBatterTable from './SumBatterTable';
import SumPitcherTable from './SumPitcherTable';
import { StyledGame } from '../styled';

const Overview = ({ games, sumBatters, sumPitchers }) => {
  return (
    <StyledGame>
      <p>{`已記錄：${R.reverse(games)[0].info.date.format('YYYY/MM/DD')} - ${games[0].info.date.format(
        'YYYY/MM/DD'
      )}`}</p>
      <SumBatterTable batters={sumBatters} />
      <SumPitcherTable pitchers={sumPitchers} />
    </StyledGame>
  );
};

export default Overview;
