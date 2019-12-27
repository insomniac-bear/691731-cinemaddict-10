export const getRandomIntegerNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length - 1);

  return array[randomIndex];
};

export const setFilter = (array, value) => {
  const filteredArray = array.slice();

  switch (value) {
    case `Sort by date`:
      filteredArray.sort((a, b) => {
        return b.filmDate - a.filmDate;
      });
      break;
    case `Sort by rating`:
      filteredArray.sort((a, b) => {
        if (b.filmRating - a.filmRating === 0) {
          return b.coomentsCount - a.commentsCount;
        } else {
          return b.filmRating - a.filmRating;
        }
      });
      break;
    case `Sort by comment count`:
      filteredArray.sort((a, b) => {
        if (b.commentsCount - a.commentsCount === 0) {
          return b.filmRating - a.filmRating;
        } else {
          return b.commentsCount - a.commentsCount;
        }
      });
      break;
    default:
      break;
  }

  return filteredArray;
};
