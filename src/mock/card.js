import {TextPattern} from '../const.js';
import {generateComments} from './comments.js';
import {getRandomIntegerNumber, getRandomArrayItem} from '../utils/common.js';

const SENTENCE_COUNT = 3;

const posterImages = [
  `./images/posters/made-for-each-other.png`,
  `./images/posters/popeye-meets-sinbad.png`,
  `./images/posters/sagebrush-trail.jpg`,
  `./images/posters/santa-claus-conquers-the-martians.jpg`,
  `./images/posters/the-dance-of-life.jpg`,
  `./images/posters/the-great-flamarion.jpg`,
  `./images/posters/the-man-with-the-golden-arm.jpg`
];

const filmNames = [
  `The Shawshenk Redemption`,
  `The Green Mile`,
  `Forest Gump`,
  `Schindler's List`,
  `Intouchables`,
  `Inception`,
  `Léon`,
  `The Lion King`,
  `Fight Club`,
  `Иван Васильевич меняет профессию`,
  `La vita è bella`,
  `Knockin on Heaven's Door`,
  `The Godfather`,
  `Pulp Fiction`,
  `The Prestige`
];

const Generes = [
  `action`,
  `comedy`,
  `dramma`,
  `musical`,
  `science fiction`
];

const generateFilmDuration = () => {
  return `${getRandomIntegerNumber(0, 2)}h ${getRandomIntegerNumber(0, 59)}m`;
};

const generateFilmRating = () => {
  return `${getRandomIntegerNumber(0, 9)}.${getRandomIntegerNumber(0, 9)}`;
};

const generateFilmDescription = () => {
  let filmDescription = ``;

  for (let i = 0; i < SENTENCE_COUNT; i++) {
    filmDescription += getRandomArrayItem(TextPattern.split(`.`));
  }
  return `${filmDescription}`;
};

const generateFilmDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateFilmStyles = (styles) => {
  return styles
    .filter(() => Math.random() > 0.5)
    .slice(0, 3);
};

const generateFilmCards = () => {
  return filmNames.map((it) => {
    return {
      id: String(new Date() + Math.random()),
      filmName: it,
      img: getRandomArrayItem(posterImages),
      filmRating: generateFilmRating(),
      filmDate: generateFilmDate(),
      filmDuration: generateFilmDuration(),
      filmStyles: new Set(generateFilmStyles(Generes)),
      filmDescription: generateFilmDescription(),
      isWatchlist: Math.random() > 0.5,
      isWatched: Math.random() > 0.5,
      isFavorite: Math.random() > 0.5,
      comments: generateComments(getRandomIntegerNumber(0, 10)),
    };
  });
};


export {generateFilmCards};
