import {TextPattern} from '../const.js';
import {getRandomArrayItem, getRandomIntegerNumber, setFormatDate} from '../utils/common.js';

const COMMENT_LENGTH = 4;

const namesOfCommentAuthor = [
  `Tim`, `Jhon`, `Richi`, `Leo`
];

const surnamesOfCommentAuthor = [
  `Macoveev`, `Doe`, `Conor`, `Lebovski`
];

const urlEmoji = [
  `./images/emoji/angry.png`, `./images/emoji/puke.png`, `./images/emoji/sleeping.png`, `./images/emoji/smile.png`, `./images/emoji/trophy.png`
];

const generateTextComment = () => {
  let textComment = ``;

  for (let i = 0; i < COMMENT_LENGTH; i++) {
    textComment = textComment + ` ${getRandomArrayItem(TextPattern.split(` `))}`;
  }
  return `${textComment}`;
};

const generateAuthor = () => {
  return `${getRandomArrayItem(namesOfCommentAuthor)} ${getRandomArrayItem(surnamesOfCommentAuthor)}`;
};

const getRandomDate = () => {
  const currentDate = new Date();
  const year = getRandomIntegerNumber(2010, 2019);
  const month = (year < currentDate.getFullYear()) ? getRandomIntegerNumber(0, 11) : getRandomIntegerNumber(0, currentDate.getMonth());
  const day = (year < currentDate.getFullYear && month < currentDate.getMonth) ? getRandomIntegerNumber(1, 31) : getRandomIntegerNumber(0, currentDate.getDate());
  const hour = getRandomIntegerNumber(0, 23);
  const minutes = getRandomIntegerNumber(0, 59);
  const date = new Date(year, month, day);

  date.setHours(hour);
  date.setMinutes(minutes);

  const timeInterval = (Date.now() - date.getTime()) / 10000 / 360 / 60;

  if (timeInterval === 0) {
    return `Today`;
  } else if (timeInterval <= 2) {
    return `${timeInterval} days ago`;
  } else {
    return `${date.getFullYear()}/${setFormatDate(date.getMonth())}/${setFormatDate(date.getDate())} ${setFormatDate(date.getHours())}:${setFormatDate(date.getMinutes())}`;
  }
};

const generateComment = () => {
  return {
    textComment: generateTextComment(),
    date: getRandomDate(),
    author: generateAuthor(),
    emoji: getRandomArrayItem(urlEmoji),
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComment, generateComments};
