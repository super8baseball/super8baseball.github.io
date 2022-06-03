import { useEffect, useState } from 'react';
import * as R from 'ramda';
import axios from 'axios';
import { parseGame, sumupBatters, sumupPitchers } from './utils/parser';
import { StyledApp } from './styled';
import CoverJPG from './assets/cover.jpg';
import Game from './features/Game';
import Overview from './features/Overview';

const fetchGames = (fileNames) => {
  const fetchGame = (name) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`/resources/${name}.csv`)
        .then(({ data }) => {
          console.log(data);
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
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    axios.get('/resources/list.txt').then(({ data }) => {
      const fileNames = R.filter((n) => n.length > 0, data.split('\n'));
      // console.log(fileNames);
      fetchGames(fileNames).then((apiGames) => {
        console.log(apiGames);
        const parsedGames = apiGames.map(parseGame);
        const sortedGames = R.sort((a, b) => (b.info.date.isAfter(a.info.date) ? 1 : -1), parsedGames);
        setGames(sortedGames);
        setSumBatters(sumupBatters(sortedGames.map((g) => g.batters)));
        setSumPitchers(sumupPitchers(sortedGames.map((g) => g.pitchers)));
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
            <option value={-1}>成績總覽</option>
            {games.map((game, gameIndex) => (
              <option key={gameIndex} value={gameIndex}>{`${game.info.season} ${game.info.date.format('YYYY/MM/DD')} ${
                game.info.away
              } - ${game.info.home}`}</option>
            ))}
          </select>
        </div>
        {games[selectedIndex] ? (
          <Game game={games[selectedIndex]} />
        ) : (
          <Overview games={games} sumBatters={sumBatters} sumPitchers={sumPitchers} />
        )}
      </div>
    </StyledApp>
  );
};

export default App;
