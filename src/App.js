import { useEffect, useState } from 'react';
import * as R from 'ramda';
import axios from 'axios';
import { parseGame, sumupBatters, sumupPitchers } from './utils/parser';
import { StyledApp } from './styled';
import CoverJPG from './assets/cover.jpg';
import Game from './features/Game';
import Overview from './features/Overview';

const TOTAL_KEY = 'OPTION_TOTAL';

const fetchGames = (fileNames) => {
  const fetchGame = (name) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/resources/${name}.csv`)
        .then(({ data }) => {
          // console.log(data);
          resolve({
            csvRaw: data,
            fileName: name,
          });
        })
        .catch(reject);
    });
  };

  return Promise.all(fileNames.map(fetchGame));
};

const App = () => {
  const [sumBatters, setSumBatters] = useState([]);
  const [sumPitchers, setSumPitchers] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(TOTAL_KEY);

  const [seasonGroups, setSeasonGroups] = useState([]);

  useEffect(() => {
    axios.get('/resources/list.txt').then(({ data }) => {
      const fileNames = R.filter((n) => n.length > 0, data.split('\n'));
      // console.log(fileNames);
      fetchGames(fileNames).then((apiGames) => {
        // console.log(apiGames);
        const parsedGames = apiGames.map(parseGame);
        const sortedGames = R.sort((a, b) => (b.info.date.isAfter(a.info.date) ? 1 : -1), parsedGames);
        setGames(sortedGames);
        setSumBatters(sumupBatters(sortedGames.map((g) => g.batters)));
        setSumPitchers(sumupPitchers(sortedGames.map((g) => g.pitchers)));

        setSeasonGroups(R.groupBy((game) => game.info.season, sortedGames));
      });
    });
  }, []);

  return (
    <StyledApp>
      <header className="header">
        <img src={CoverJPG} alt={CoverJPG} />
        <div className="mask" />
        <div className="wrapper">
          <h1>Super8</h1>
          <h3>超級8 北市社會棒球隊</h3>
        </div>
      </header>
      <div className="content">
        <div className="tab-switch">
          <select value={selectedIndex} onChange={(e) => setSelectedIndex(e.target.value)}>
            <option value={TOTAL_KEY}>成績總覽</option>
            {Object.keys(seasonGroups).map((seasonName) => (
              <option key={seasonName} value={seasonName}>{`賽事總覽 - ${seasonName}`}</option>
            ))}
            {games.map((game, gameIndex) => (
              <option key={gameIndex} value={gameIndex}>{`${game.info.season} ${game.info.date.format('YYYY/MM/DD')} ${
                game.info.away
              } - ${game.info.home}`}</option>
            ))}
          </select>
        </div>
        {selectedIndex === TOTAL_KEY ? (
          <Overview key={selectedIndex} games={games} sumBatters={sumBatters} sumPitchers={sumPitchers} />
        ) : R.is(String, selectedIndex) && seasonGroups[selectedIndex] ? (
          <Overview
            key={selectedIndex}
            games={seasonGroups[selectedIndex]}
            sumBatters={sumupBatters(seasonGroups[selectedIndex].map((g) => g.batters))}
            sumPitchers={sumupPitchers(seasonGroups[selectedIndex].map((g) => g.pitchers))}
          />
        ) : (
          <Game key={selectedIndex} game={games[selectedIndex]} />
        )}
      </div>
    </StyledApp>
  );
};

export default App;
