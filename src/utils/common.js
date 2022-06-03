export const numberDisplay = (number) => {
  if (number < 0) {
    return '-';
  }

  if (number === 0) {
    return '#00';
  }

  return `#${number}`;
};

export const positionDisplay = (position) => {
  let wording = `${position}`;
  switch (position) {
    case '1':
      wording = 'P';
      break;
    case '2':
      wording = 'C';
      break;
    case '3':
      wording = '1B';
      break;
    case '4':
      wording = '2B';
      break;
    case '5':
      wording = '3B';
      break;
    case '6':
      wording = 'SS';
      break;
    case '7':
      wording = 'LF';
      break;
    case '8':
      wording = 'CF';
      break;
    case '9':
      wording = 'RF';
      break;
    case '0':
    case '10':
      wording = 'DH';
      break;
    default:
      break;
  }

  return wording;
};
