import moment from 'moment';
import convertCSVToArray from 'convert-csv-to-array';
import * as R from 'ramda';

const parseFielding = (cell) => {
  const data = {
    TC: 0,
    TC_E: 0,
  };
  if (cell === '' || !cell.match(/^\d+;\d+$/)) {
    return data;
  }

  const fielding = cell.split(';');
  data.TC = parseInt(fielding[0]) ?? 0;
  data.TC_E = parseInt(fielding[1]) ?? 0;
  return data;
};

const parseCatcherFielding = (cell) => {
  const data = {
    C_BP: 0,
    C_SB: 0,
    C_CS: 0,
  };
  if (cell === '' || !cell.match(/^\d+;\d+;\d+$/)) {
    return data;
  }

  const fielding = cell.split(';');
  data.C_BP = parseInt(fielding[0]) ?? 0;
  data.C_SB = parseInt(fielding[1]) ?? 0;
  data.C_CS = parseInt(fielding[2]) ?? 0;
  return data;
};

const parseSBCS = (cell) => {
  const data = {
    SB: 0,
    CS: 0,
  };
  if (cell === '' || !cell.match(/^\d+;\d+$/)) {
    return data;
  }

  const SBCS = cell.split(';');
  data.SB = parseInt(SBCS[0]) ?? 0;
  data.CS = parseInt(SBCS[1]) ?? 0;
  return data;
};

const parsePA = (PAList) => {
  const box = {
    PA: 0,
    AB: 0,
    H: 0,
    DOUBLE: 0,
    TRIPLE: 0,
    HR: 0,
    K: 0,
    BB: 0,
    HBP: 0,
    SF: 0,
    SH: 0,
    DP: 0,
    FC: 0,
    E: 0,
    FO: 0,
    GO: 0,
  };
  const hasResult = R.filter((cell) => cell !== '', PAList);
  hasResult.forEach((result) => {
    let isAB = true;
    switch (result) {
      case 'H':
        box.H++;
        break;
      case '2B':
        box.H++;
        box.DOUBLE++;
        break;
      case '3B':
        box.H++;
        box.TRIPLE++;
        break;
      case 'HR':
        box.H++;
        box.HR++;
        break;
      case 'K':
      case 'SO':
        box.K++;
        break;
      case 'BB':
      case 'uBB':
      case 'IBB':
        box.BB++;
        isAB = false;
        break;
      case 'HBP':
        box.HBP++;
        isAB = false;
        break;
      case 'SF':
        box.SF++;
        isAB = false;
        break;
      case 'SAC':
      case 'SH':
        box.SH++;
        isAB = false;
        break;
      case 'DP':
      case 'FC':
      case 'E':
      case 'FO':
      case 'GO':
        box[result]++;
        break;
      default:
        isAB = false;
        break;
    }
    box.PA++;
    if (isAB) {
      box.AB++;
    }
  });
  return box;
};

const toInt = (cell) => {
  if (cell === '') {
    return 0;
  }

  const possibleInt = parseInt(cell);
  return Number.isNaN(possibleInt) ? 0 : possibleInt;
};

export const parseGame = ({ csvRaw: csv, fileName }) => {
  const csvArray = convertCSVToArray(csv, { type: 'array' });
  console.log(csvArray);
  const info = {
    season: csvArray[0][0],
    date: moment(csvArray[0][1]),
    location: csvArray[0][2],
    away: csvArray[2][0],
    awayScores: R.filter(
      (score) => score !== '',
      new Array(12).fill('').map((_, inningIndex) => csvArray[2][inningIndex + 1])
    ),
    home: csvArray[3][0],
    homeScores: R.filter(
      (score) => score !== '',
      new Array(12).fill('').map((_, inningIndex) => csvArray[3][inningIndex + 1])
    ),
    snapshotSrc: `/resources/${fileName}.jpg`,
  };

  const pitchers = [];
  for (let rowIndex = 5; rowIndex <= 13; rowIndex++) {
    const row = csvArray[rowIndex];
    if (row[0] === '') {
      continue;
    }

    const pitcher = {
      name: row[0],
      IPOuts: row[2],
      H: toInt(row[3]),
      HR: toInt(row[4]),
      BB: toInt(row[5]),
      HBP: toInt(row[6]),
      K: toInt(row[7]),
      WP: toInt(row[8]),
      R: toInt(row[9]),
      ER: toInt(row[10]),
      ...parseFielding(row[11]),
    };
    pitchers.push(pitcher);
  }

  const batters = [];
  for (let rowIndex = 15; rowIndex <= csvArray.length - 1; rowIndex++) {
    const row = csvArray[rowIndex];
    if (row[0] === '' || row[1] === '' || !R.is(Number, row[0])) {
      continue;
    }

    const batter = {
      order: row[0],
      name: row[1],
      positions: R.is(Number, row[3]) ? [`${row[3]}`] : row[3].split(';'),
      ...parseFielding(row[4]),
      ...parseCatcherFielding(row[5]),
      ...parseSBCS(row[6]),
      R: toInt(row[7]),
      RBI: toInt(row[8]),
      ...parsePA(row.slice(9)),
    };
    batters.push(batter);
  }

  return {
    info,
    pitchers,
    batters,
    csvArray,
  };
};

export const sumupBatters = (battersList) => {
  const batters = R.flatten(battersList);
  const batterMapping = R.groupBy((b) => b.name, batters);
  const excludeColumns = ['order', 'name', 'positions'];

  return Object.keys(batterMapping).map((batterName) => {
    const records = batterMapping[batterName];
    const batter = {
      ...records[0],
    };
    excludeColumns.forEach((excludeColumn) => {
      delete batter[excludeColumn];
    });

    if (records.length > 1) {
      records.slice(1).forEach((record) => {
        Object.keys(batter).forEach((column) => {
          batter[column] += record[column];
        });
      });
    }
    batter.name = batterName;
    batter.AVG = batter.AB === 0 ? '0.000' : (batter.H / batter.AB).toFixed(3);
    batter.OBP = batter.PA === 0 ? '0.000' : ((batter.H + batter.BB + batter.HBP) / batter.PA).toFixed(3);
    batter.TCPT = batter.TC === 0 ? '0.00' : ((batter.TC - batter.TC_E) / batter.TC).toFixed(2);
    return batter;
  });
};

export const sumupPitchers = (pitchersList) => {
  const pitchers = R.flatten(pitchersList);
  const pitcherMapping = R.groupBy((b) => b.name, pitchers);
  const excludeColumns = ['name'];

  return Object.keys(pitcherMapping).map((pitcherName) => {
    const records = pitcherMapping[pitcherName];
    const pitcher = {
      ...records[0],
    };
    excludeColumns.forEach((excludeColumn) => {
      delete pitcher[excludeColumn];
    });

    if (records.length > 1) {
      records.slice(1).forEach((record) => {
        Object.keys(pitcher).forEach((column) => {
          pitcher[column] += record[column];
        });
      });
    }
    pitcher.name = pitcherName;
    return pitcher;
  });
};
