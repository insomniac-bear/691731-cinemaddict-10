import {TextPattern} from '../const.js';
import {getRandomArrayItem, getRandomIntegerNumber} from '../utils/common.js';

const COMMENT_LENGTH = 4;

const namesOfCommentAuthor = [
  `Tim`, `Jhon`, `Richi`, `Leo`
];

const surnamesOfCommentAuthor = [
  `Macoveev`, `Doe`, `Conor`, `Lebovski`
];

const emoji = [
  `SMILE`,
  `SLEEPING`,
  `GPUKE`,
  `ANGRY`,
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
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateComment = () => {
  return {
    textComment: generateTextComment(),
    date: getRandomDate(),
    author: generateAuthor(),
    emoji: getRandomArrayItem(emoji),
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComment, generateComments};
