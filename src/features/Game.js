import * as R from 'ramda';
import BigPicture from 'bigpicture';
import BatterTable from './BatterTable';
import PitcherTable from './PitcherTable';
import { StyledGame, StyledTable } from '../styled';

const Game = ({ game }) => {
  return (
    <StyledGame>
      <p>{`${game.info.date.format('YYYY/MM/DD')}`}</p>
      <p>{`${game.info.season}@${game.info.location}`}</p>
      <StyledTable>
        <table>
          <thead>
            <tr>
              <th></th>
              {new Array(game.info.awayScores.length).fill('').map((_, index) => (
                <th key={index}>{index + 1}</th>
              ))}
              <th>得分</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{game.info.away}</td>
              {new Array(game.info.awayScores.length).fill('').map((_, index) => (
                <td key={index}>{game.info.awayScores[index] ?? '-'}</td>
              ))}
              <td>{R.sum(R.filter((s) => R.is(Number, s), game.info.awayScores))}</td>
            </tr>
            <tr>
              <td>{game.info.home}</td>
              {new Array(game.info.awayScores.length).fill('').map((_, index) => (
                <td key={index}>{game.info.homeScores[index] ?? '-'}</td>
              ))}
              <td>{R.sum(R.filter((s) => R.is(Number, s), game.info.homeScores))}</td>
            </tr>
          </tbody>
        </table>
      </StyledTable>
      <BatterTable batters={game.batters} />
      <PitcherTable pitchers={game.pitchers} />
      <img
        className="snapshot"
        src={game.info.snapshotSrc}
        onClick={(e) =>
          BigPicture({
            el: e.target,
            imgSrc: game.info.snapshotSrc,
          })
        }
      />
    </StyledGame>
  );
};

export default Game;
